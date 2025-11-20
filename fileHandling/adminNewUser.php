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
    if(!isset($_POST['fullname']) || !isset($_POST['email']) || !isset($_POST['password']) || !isset($_POST['role'])) {
        echo "0";
        exit();
    }

    // Get POST data
    $full_name = trim($_POST['fullname']);
    $email     = trim($_POST['email']);
    $password  = $_POST['password'];
    $role      = $_POST['role'];
    $year      = isset($_POST['year']) ? $_POST['year'] : "";

    // Validate input
    if(empty($full_name) || empty($email) || empty($password) || empty($role)) {
        echo "0";
        exit();
    }

    // ROLE CONVERSION
    if ($role == "Student") {
        $role_id = 1;
    } elseif ($role == "Lecturer") {
        $role_id = 2;
    } elseif ($role == "Admin") {
        $role_id = 3;
    } else {
        $role_id = 0;
    }

    // YEAR CONVERSION (only for students)
    $year_id = 0;
    if ($role == "Student") {
        if ($year == "first")  $year_id = 1;
        elseif ($year == "second") $year_id = 2;
        elseif ($year == "third")  $year_id = 3;
        elseif ($year == "fourth") $year_id = 4;
    }

    // Hash password using MD5
    $password_hash = md5($password);

    // Split name
    $first_name = strtok($full_name, ' ');
    $last_name  = trim(strstr($full_name, ' '));
    if ($last_name === false) $last_name = "";

    // ESCAPE (SQL Injection protection)
    $email        = mysqli_real_escape_string($con, $email);
    $password_hash= mysqli_real_escape_string($con, $password_hash);
    $first_name   = mysqli_real_escape_string($con, $first_name);
    $last_name    = mysqli_real_escape_string($con, $last_name);
    $full_name    = mysqli_real_escape_string($con, $full_name);

    // Check if email already exists
    $check_email_query = "SELECT id FROM users WHERE email = '$email'";
    $check_result = mysqli_query($con, $check_email_query);
    if(mysqli_num_rows($check_result) > 0) {
        echo "0"; // Email already exists
        exit();
    }

    // INSERT QUERY
    $query = "
        INSERT INTO users
        (email, password_hash, first_name, last_name, display_name, role_id, year_id, is_active, created_at, updated_at)
        VALUES
        ('$email', '$password_hash', '$first_name', '$last_name', '$full_name', $role_id, $year_id, 1, NOW(), NOW())
    ";

    $result = mysqli_query($con, $query);

    if ($result) {
        $user_id_inserted = mysqli_insert_id($con);
        $new_values = json_encode(array(
            'full_name' => $full_name, 
            'email' => $email, 
            'first_name' => $first_name, 
            'last_name' => $last_name, 
            'role_id' => $role_id, 
            'year_id' => $year_id, 
            'status' => 1
        ));
        
        // Log activity
        $log_query = "
            INSERT INTO audit_logs
            (user_id, action, table_name, record_id, old_values, new_values, ip_address, user_agent, created_at)
            VALUES
            ({$_SESSION['user_id']}, 'Add user \"$full_name\"', 'users', $user_id_inserted, '', '$new_values', '{$_SERVER['REMOTE_ADDR']}', '{$_SERVER['HTTP_USER_AGENT']}', NOW())
        ";
        mysqli_query($con, $log_query);
        echo "1";
    } else {
        echo "0";
    }

    exit();

} else if($id == "update"){
    
    // Validate required fields
    if(!isset($_POST['fullname']) || !isset($_POST['email']) || !isset($_POST['role']) || !isset($_POST['user_id']) || !isset($_POST['status'])) {
        echo "0";
        exit();
    }

    // Get POST data
    $full_name = trim($_POST['fullname']);
    $email     = trim($_POST['email']);
    $role      = $_POST['role'];
    $year      = isset($_POST['year']) ? $_POST['year'] : "";
    $user_id   = $_POST['user_id'];
    $status    = $_POST['status'];

    // Validate input
    if(empty($full_name) || empty($email) || empty($role) || empty($user_id)) {
        echo "0";
        exit();
    }

    // ROLE CONVERSION
    if ($role == "Student") {
        $role_id = 1;
    } elseif ($role == "Lecturer") {
        $role_id = 2;
    } elseif ($role == "Admin") {
        $role_id = 3;
    } else {
        $role_id = 0;
    }

    // YEAR CONVERSION (only for students)
    $year_id = 0;
    if ($role == "Student") {
        if ($year == "first")  $year_id = 1;
        elseif ($year == "second") $year_id = 2;
        elseif ($year == "third")  $year_id = 3;
        elseif ($year == "fourth") $year_id = 4;
    }

    // Split name
    $first_name = strtok($full_name, ' ');
    $last_name  = trim(strstr($full_name, ' '));
    if ($last_name === false) $last_name = "";

    // ESCAPE (SQL Injection protection)
    $email        = mysqli_real_escape_string($con, $email);
    $first_name   = mysqli_real_escape_string($con, $first_name);
    $last_name    = mysqli_real_escape_string($con, $last_name);
    $full_name    = mysqli_real_escape_string($con, $full_name);
    $user_id      = mysqli_real_escape_string($con, $user_id);
    $status       = mysqli_real_escape_string($con, $status);

    // Check if email already exists for other users
    $check_email_query = "SELECT id FROM users WHERE email = '$email' AND id != $user_id";
    $check_result = mysqli_query($con, $check_email_query);
    if(mysqli_num_rows($check_result) > 0) {
        echo "0"; // Email already exists for another user
        exit();
    }

    // Get old values for audit log
    $old_query = "SELECT display_name, email, role_id, year_id, is_active FROM users WHERE id = $user_id";
    $old_result = mysqli_query($con, $old_query);
    $old_data = mysqli_fetch_assoc($old_result);
    $old_values = json_encode($old_data);

    // UPDATE QUERY
    $query = "
        UPDATE users
        SET email='$email', first_name='$first_name', last_name='$last_name', display_name='$full_name', role_id=$role_id, year_id=$year_id, updated_at=NOW(), is_active=$status
        WHERE id=$user_id
    ";

    $result = mysqli_query($con, $query);

    if ($result) {
        $new_values = json_encode(array(
            'full_name' => $full_name, 
            'email' => $email, 
            'first_name' => $first_name, 
            'last_name' => $last_name, 
            'role_id' => $role_id, 
            'year_id' => $year_id, 
            'status' => $status
        ));
        
        // Log activity
        $log_query = "
            INSERT INTO audit_logs
            (user_id, action, table_name, record_id, old_values, new_values, ip_address, user_agent, created_at)
            VALUES
            ({$_SESSION['user_id']}, 'Update user \"$full_name\"', 'users', $user_id, '$old_values', '$new_values', '{$_SERVER['REMOTE_ADDR']}', '{$_SERVER['HTTP_USER_AGENT']}', NOW())
        ";
        mysqli_query($con, $log_query);
        echo "1";
    } else {
        echo "0";
    }

    exit();

} else if($id == "delete"){
    
    // Validate required fields
    if(!isset($_POST['user_id'])) {
        echo "0";
        exit();
    }

    $user_id = $_POST['user_id'];

    // Validate input
    if(empty($user_id)) {
        echo "0";
        exit();
    }

    // ESCAPE (SQL Injection protection)
    $user_id = mysqli_real_escape_string($con, $user_id);

    // Get user data for audit log before deleting
    $user_query = "SELECT display_name, email FROM users WHERE id = $user_id";
    $user_result = mysqli_query($con, $user_query);
    
    if(mysqli_num_rows($user_result) == 0) {
        echo "0"; // User not found
        exit();
    }
    
    $user_data = mysqli_fetch_assoc($user_result);
    $full_name = $user_data['display_name'];
    $email = $user_data['email'];

    // Get old values for audit log
    $old_query = "SELECT * FROM users WHERE id = $user_id";
    $old_result = mysqli_query($con, $old_query);
    $old_data = mysqli_fetch_assoc($old_result);
    $old_values = json_encode($old_data);

    // DELETE QUERY
    $query = "DELETE FROM users WHERE id = $user_id";
    $result = mysqli_query($con, $query);

    if ($result) {
        // Log activity
        $log_query = "
            INSERT INTO audit_logs
            (user_id, action, table_name, record_id, old_values, new_values, ip_address, user_agent, created_at)
            VALUES
            ({$_SESSION['user_id']}, 'Delete user \"$full_name\"', 'users', $user_id, '$old_values', '', '{$_SERVER['REMOTE_ADDR']}', '{$_SERVER['HTTP_USER_AGENT']}', NOW())
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