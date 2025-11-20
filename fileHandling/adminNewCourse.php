<?php
include '../connect.php';

session_start();
if(!isset($_SESSION['user_id'])){
    header("Location: ../index.php");
    exit();
}

// Check if id parameter exists
if(!isset($_GET['id'])) {
    echo "0";
    exit();
}

$id = $_GET['id'];

if ($id == "save") {
    // Validate required fields
    if(!isset($_POST['courseCode']) || !isset($_POST['courseName']) || !isset($_POST['courseDesc']) || !isset($_POST['courseInstructor']) || !isset($_POST['courseCredits']) || !isset($_POST['courseYear'])) {
        echo "0";
        exit();
    }

    // Get POST data
    $course_code = trim($_POST['courseCode']);
    $course_name = trim($_POST['courseName']);
    $course_desc = trim($_POST['courseDesc']);
    $course_instructor = trim($_POST['courseInstructor']);
    $course_credits = intval($_POST['courseCredits']);
    $course_year = intval($_POST['courseYear']);

    // Validate input
    if(empty($course_code) || empty($course_name) || empty($course_instructor)) {
        echo "0";
        exit();
    }

    // ESCAPE (SQL Injection protection)
    $course_code = mysqli_real_escape_string($con, $course_code);
    $course_name = mysqli_real_escape_string($con, $course_name);
    $course_desc = mysqli_real_escape_string($con, $course_desc);
    $course_instructor = mysqli_real_escape_string($con, $course_instructor);

    // Check if course code already exists
    $check_code_query = "SELECT id FROM courses WHERE course_code = '$course_code'";
    $check_result = mysqli_query($con, $check_code_query);
    if(mysqli_num_rows($check_result) > 0) {
        echo "0"; // Course code already exists
        exit();
    }

    // INSERT QUERY
    $query = "
        INSERT INTO courses
        (course_code, course_name, description, lecturer_id, credits, year_id, created_at, updated_at, is_active)
        VALUES
        ('$course_code', '$course_name', '$course_desc', '$course_instructor', $course_credits, $course_year, NOW(), NOW(), 1)
    ";

    $result = mysqli_query($con, $query);

    if ($result) {
        $course_id_inserted = mysqli_insert_id($con);
        $new_values = json_encode(array(
            'course_name' => $course_name, 
            'course_code' => $course_code, 
            'description' => $course_desc, 
            'lecturer_id' => $course_instructor, 
            'credits' => $course_credits,
            'year_id' => $course_year, 
            'status' => 1
        ));
        
        // Log activity - FIXED: Use correct variable names
        $log_query = "
            INSERT INTO audit_logs
            (user_id, action, table_name, record_id, old_values, new_values, ip_address, user_agent, created_at)
            VALUES
            ({$_SESSION['user_id']}, 'Add course \"$course_code - $course_name\"', 'courses', $course_id_inserted, '', '$new_values', '{$_SERVER['REMOTE_ADDR']}', '{$_SERVER['HTTP_USER_AGENT']}', NOW())
        ";
        mysqli_query($con, $log_query);
        echo "1";
    } else {
        echo "0";
    }

    exit();

} else if ($id == "update") {
    // Validate required fields
    if(!isset($_POST['course_id']) || !isset($_POST['courseCode']) || !isset($_POST['courseName']) || !isset($_POST['courseDesc']) || !isset($_POST['courseInstructor']) || !isset($_POST['courseCredits']) || !isset($_POST['courseYear']) || !isset($_POST['courseStatus'])) {
        echo "0";
        exit();
    }

    // Get POST data
    $course_id = intval($_POST['course_id']);
    $course_code = trim($_POST['courseCode']);
    $course_name = trim($_POST['courseName']);
    $course_desc = trim($_POST['courseDesc']);
    $course_instructor = trim($_POST['courseInstructor']);
    $course_credits = intval($_POST['courseCredits']);
    $course_year = intval($_POST['courseYear']);
    $course_status = intval($_POST['courseStatus']);

    // Validate input
    if(empty($course_id) || empty($course_code) || empty($course_name) || empty($course_instructor)) {
        echo "0";
        exit();
    }

    // ESCAPE (SQL Injection protection)
    $course_code = mysqli_real_escape_string($con, $course_code);
    $course_name = mysqli_real_escape_string($con, $course_name);
    $course_desc = mysqli_real_escape_string($con, $course_desc);
    $course_instructor = mysqli_real_escape_string($con, $course_instructor);

    // Check if course code already exists for other courses
    $check_code_query = "SELECT id FROM courses WHERE course_code = '$course_code' AND id != $course_id";
    $check_result = mysqli_query($con, $check_code_query);
    if(mysqli_num_rows($check_result) > 0) {
        echo "0"; // Course code already exists for another course
        exit();
    }

    // Get old values for audit log
    $old_query = "SELECT course_code, course_name, description, lecturer_id, credits, year_id, is_active FROM courses WHERE id = $course_id";
    $old_result = mysqli_query($con, $old_query);
    $old_data = mysqli_fetch_assoc($old_result);
    $old_values = json_encode($old_data);

    // UPDATE QUERY
    $query = "
        UPDATE courses SET
        course_code = '$course_code',
        course_name = '$course_name',
        description = '$course_desc',
        lecturer_id = '$course_instructor',
        credits = $course_credits,
        year_id = $course_year,
        is_active = $course_status,
        updated_at = NOW()
        WHERE id = $course_id
    ";

    $result = mysqli_query($con, $query);

    if ($result) {
        $new_values = json_encode(array(
            'course_name' => $course_name, 
            'course_code' => $course_code, 
            'description' => $course_desc, 
            'lecturer_id' => $course_instructor, 
            'credits' => $course_credits,
            'year_id' => $course_year, 
            'status' => $course_status
        ));
        
        // Log activity - FIXED: Use correct course_id and variable names
        $log_query = "
            INSERT INTO audit_logs
            (user_id, action, table_name, record_id, old_values, new_values, ip_address, user_agent, created_at)
            VALUES
            ({$_SESSION['user_id']}, 'Update course \"$course_code - $course_name\"', 'courses', $course_id, '$old_values', '$new_values', '{$_SERVER['REMOTE_ADDR']}', '{$_SERVER['HTTP_USER_AGENT']}', NOW())
        ";
        mysqli_query($con, $log_query);
        echo "1";
    } else {
        echo "0";
    }

    exit();

} else if($id == "delete") {
    // Validate required fields
    if(!isset($_POST['course_id'])) {
        echo "0";
        exit();
    }

    $course_id = intval($_POST['course_id']);

    // Validate input
    if(empty($course_id)) {
        echo "0";
        exit();
    }

    // Get course data for audit log before deleting
    $course_query = "SELECT course_code, course_name FROM courses WHERE id = $course_id";
    $course_result = mysqli_query($con, $course_query);
    
    if(mysqli_num_rows($course_result) == 0) {
        echo "0"; // Course not found
        exit();
    }
    
    $course_data = mysqli_fetch_assoc($course_result);
    $course_code = $course_data['course_code'];
    $course_name = $course_data['course_name'];

    // Get old values for audit log
    $old_query = "SELECT * FROM courses WHERE id = $course_id";
    $old_result = mysqli_query($con, $old_query);
    $old_data = mysqli_fetch_assoc($old_result);
    $old_values = json_encode($old_data);

    // DELETE QUERY
    $query = "DELETE FROM courses WHERE id = $course_id";
    $result = mysqli_query($con, $query);

    if ($result) {
        // Log activity - FIXED: Correct action message and use empty new_values
        $log_query = "
            INSERT INTO audit_logs
            (user_id, action, table_name, record_id, old_values, new_values, ip_address, user_agent, created_at)
            VALUES
            ({$_SESSION['user_id']}, 'Delete course \"$course_code - $course_name\"', 'courses', $course_id, '$old_values', '', '{$_SERVER['REMOTE_ADDR']}', '{$_SERVER['HTTP_USER_AGENT']}', NOW())
        ";
        mysqli_query($con, $log_query);
        echo "1";
    } else {
        echo "0";
    }

    exit();
} else {
    echo "0"; // Invalid action
    exit();
}
?>