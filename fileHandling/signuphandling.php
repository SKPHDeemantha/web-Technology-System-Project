<?php
include '../connect.php';
session_start();
$_SESSION['user_id'] = null;

$id = $_GET['id'];

if ($id == "save") {

    // Get POST data (MATCH AJAX NAMES)
    $full_name = trim($_POST['fullname']);
    $email     = $_POST['email'];
    $password  = $_POST['password'];
    $role      = $_POST['role'];
    $year      = isset($_POST['year']) ? $_POST['year'] : "";

    // ROLE CONVERSION
    if ($role == "student") {
        $role_id = 1;
    } elseif ($role == "lecturer") {
        $role_id = 2;
    } elseif ($role == "admin") {
        $role_id = 3;
    } else {
        $role_id = 0;
    }

    // YEAR CONVERSION
    if ($year == "1")  $year_id = 1;
    elseif ($year == "2") $year_id = 2;
    elseif ($year == "3")  $year_id = 3;
    elseif ($year == "4") $year_id = 4;
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
} else if ($id == "check"){ //login process
    $email = $_POST['email'];
    $password = $_POST['password'];
    $role = $_POST['role'];
    $year = isset($_POST['year']) ? $_POST['year'] : "";

    // ROLE CONVERSION
    if ($role == "student") {
        $role_id = 1;
    } elseif ($role == "lecturer") {
        $role_id = 2;
    } elseif ($role == "admin") {
        $role_id = 3;
    } else {
        $role_id = 0;
    }

    // YEAR CONVERSION
    if ($year == "1")  $year_id = 1;
    elseif ($year == "2") $year_id = 2;
    elseif ($year == "3")  $year_id = 3;
    elseif ($year == "4") $year_id = 4;
    else $year_id = 0;

    // Hash password (OLD WAY)
    $password_hash = md5($password);

// ESCAPE (SQL Injection protection)
    $email        = mysqli_real_escape_string($con, $email);
    $password_hash= mysqli_real_escape_string($con, $password_hash);

    $query = "SELECT * FROM users WHERE email='$email' AND password_hash='$password_hash' AND is_active=1 AND role_id=$role_id AND year_id= $year_id LIMIT 1";
    $result = mysqli_query($con, $query);
    if (mysqli_num_rows($result) == 1) {
        $user = mysqli_fetch_assoc($result);
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['user_role'] = $user['role_id'];
        echo 1; // Login successful
    } else {
        echo 0; // Login failed
    }
    exit();
}
?>
