<?php
include '../connect.php';

session_start();
if(!isset($_SESSION['user_id'])){
    header("Location: ../index.php");
    exit();
}
$id = $_GET['id'];

if ($id == "save") {

    // Get POST data (MATCH AJAX NAMES)
    $course_code = trim($_POST['courseCode']);
    $course_name = trim($_POST['courseName']);
    $course_desc = trim($_POST['courseDesc']);
    $course_instructor = trim($_POST['courseInstructor']);
    $course_credits = intval($_POST['courseCredits']);
    $course_year = intval($_POST['courseYear']);

    // ESCAPE (SQL Injection protection)
    $course_code = mysqli_real_escape_string($con, $course_code);
    $course_name = mysqli_real_escape_string($con, $course_name);
    $course_desc = mysqli_real_escape_string($con, $course_desc);
    $course_instructor = mysqli_real_escape_string($con, $course_instructor);

    // INSERT QUERY
    $query = "
        INSERT INTO courses
        (course_code, course_name, description, lecturer_id, credits, year_id, created_at, updated_at, is_active)
        VALUES
        ('$course_code', '$course_name', '$course_desc', '$course_instructor', $course_credits, $course_year, NOW(), NOW(), 1)
    ";

    if (mysqli_query($con, $query)) {
        echo 1;
    } else {
        echo "Error: " . mysqli_error($con);
    }
} else if ($id == "update"){

    // Get POST data (MATCH AJAX NAMES)
    $course_id = intval($_POST['course_id']);
    $course_code = trim($_POST['courseCode']);
    $course_name = trim($_POST['courseName']);
    $course_desc = trim($_POST['courseDesc']);
    $course_instructor = trim($_POST['courseInstructor']);
    $course_credits = intval($_POST['courseCredits']);
    $course_year = intval($_POST['courseYear']);
    $course_status = intval($_POST['courseStatus']);

    // ESCAPE (SQL Injection protection)
    $course_code = mysqli_real_escape_string($con, $course_code);
    $course_name = mysqli_real_escape_string($con, $course_name);
    $course_desc = mysqli_real_escape_string($con, $course_desc);
    $course_instructor = mysqli_real_escape_string($con, $course_instructor);

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

    if (mysqli_query($con, $query)) {
        echo 1;
    } else {
        echo "Error: " . mysqli_error($con);
    }
}else if($id == "delete"){
    $course_id = intval($_POST['course_id']);

    // ESCAPE (SQL Injection protection)
    $course_id      = mysqli_real_escape_string($con, $course_id);

    // DELETE QUERY
    $query = "
        DELETE FROM courses
        WHERE id=$course_id
    ";

    $result = mysqli_query($con, $query);

    // AJAX expects output, not redirect
    if ($result) {
        echo 1;
    } else {
        echo 0;
    }

    exit();
}


?>