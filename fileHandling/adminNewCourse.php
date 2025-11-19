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
    echo $query = "
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
}


?>