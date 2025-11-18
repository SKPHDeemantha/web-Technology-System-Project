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
    $name = trim($_POST['name']);
    $description = trim($_POST['description']);
    $category = $_POST['category'];

    // ESCAPE (SQL Injection protection)
    $name = mysqli_real_escape_string($con, $name);
    $description = mysqli_real_escape_string($con, $description);
    $category = mysqli_real_escape_string($con, $category);

    $created_by = $_SESSION['user_id'];
    // INSERT QUERY
    $query = "INSERT INTO communities (name, description, category, created_by, is_active, created_at, updated_at) VALUES ('$name', '$description', '$category', $created_by, 1, NOW(), NOW())";

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