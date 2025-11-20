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
    $full_name = trim($_POST['fullname']);
    $email     = $_POST['email'];
    $password  = $_POST['password'];
    $role      = $_POST['role'];
    // $year      = isset($_POST['year']) ? $_POST['year'] : "";
    $year      = "first";

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

    // YEAR CONVERSION
    if ($year == "first")  $year_id = 1;
    elseif ($year == "second") $year_id = 2;
    elseif ($year == "third")  $year_id = 3;
    elseif ($year == "fourth") $year_id = 4;
    else $year_id = 0;

    // Hash password (OLD WAY)
    $password_hash = md5($password);

    // Split name
    $first_name = strtok($full_name, ' ');
    $last_name  = trim(strstr($full_name, ' '));
    if ($last_name == false) $last_name = "";

    // ESCAPE (SQL Injection protection)
    $email        = mysqli_real_escape_string($con, $email);
    $password_hash= mysqli_real_escape_string($con, $password_hash);
    $first_name   = mysqli_real_escape_string($con, $first_name);
    $last_name    = mysqli_real_escape_string($con, $last_name);
    $full_name    = mysqli_real_escape_string($con, $full_name);

    // INSERT QUERY
    $query = "
        INSERT INTO users
        (email, password_hash, first_name, last_name, display_name, role_id, year_id, is_active, created_at, updated_at)
        VALUES
        ('$email', '$password_hash', '$first_name', '$last_name', '$full_name', $role_id, $year_id, 1, NOW(), NOW())
    ";

    $result = mysqli_query($con, $query);

    // AJAX expects output, not redirect
    if ($result) {
        echo 1;
    } else {
        echo 0;
    }

    exit();
} else if($id == "update"){
    
    // Get POST data (MATCH AJAX NAMES)
    $full_name = trim($_POST['fullname']);
    $email     = $_POST['email'];
    $role      = $_POST['role'];
    // $year      = isset($_POST['year']) ? $_POST['year'] : "";
    $year      = "first";
    $user_id   = $_POST['user_id'];
    $status    = $_POST['status'];

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

    // YEAR CONVERSION
    if ($year == "first")  $year_id = 1;
    elseif ($year == "second") $year_id = 2;
    elseif ($year == "third")  $year_id = 3;
    elseif ($year == "fourth") $year_id = 4;
    else $year_id = 0;

    // Split name
    $first_name = strtok($full_name, ' ');
    $last_name  = trim(strstr($full_name, ' '));
    if ($last_name == false) $last_name = "";

    // ESCAPE (SQL Injection protection)
    $email        = mysqli_real_escape_string($con, $email);
    $first_name   = mysqli_real_escape_string($con, $first_name);
    $last_name    = mysqli_real_escape_string($con, $last_name);
    $full_name    = mysqli_real_escape_string($con, $full_name);
    $user_id      = mysqli_real_escape_string($con, $user_id);
    $status      = mysqli_real_escape_string($con, $status);

    // UPDATE QUERY
    $query = "
        UPDATE users
        SET email='$email', first_name='$first_name', last_name='$last_name', display_name='$full_name', role_id=$role_id, year_id=$year_id, updated_at=NOW(), is_active=$status
        WHERE id=$user_id
    ";

    $result = mysqli_query($con, $query);

    // AJAX expects output, not redirect
    if ($result) {
        echo 1;
    } else {
        echo 0;
    }

    exit();
} else if($id == "delete"){
    $user_id = $_POST['user_id'];

    // ESCAPE (SQL Injection protection)
    $user_id      = mysqli_real_escape_string($con, $user_id);

    // DELETE QUERY
    $query = "
        DELETE FROM users
        WHERE id=$user_id
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
