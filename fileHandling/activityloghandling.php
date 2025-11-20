<?php

include '../connect.php';

session_start();

if(!isset($_SESSION['user_id'])){
    header("Location: ../index.php");
    exit();
}

$id = $_GET['id'];

if ($id == "logActivity") {

    // Get POST data
    $user_id = trim($_POST['user_id']);
    $action = trim($_POST['action']);
    $table_name = trim($_POST['table_name']);
    $record_id = trim($_POST['record_id']);
    $old_values = trim($_POST['old_values']);
    $new_values = trim($_POST['new_values']);
    $ip_address = trim($_POST['ip_address']);
    $user_agent = trim($_POST['user_agent']);

    // ESCAPE
    $user_id = mysqli_real_escape_string($con, $user_id);
    $action = mysqli_real_escape_string($con, $action);
    $table_name = mysqli_real_escape_string($con, $table_name);
    $record_id = mysqli_real_escape_string($con, $record_id);
    $old_values = mysqli_real_escape_string($con, $old_values);
    $new_values = mysqli_real_escape_string($con, $new_values);
    $ip_address = mysqli_real_escape_string($con, $ip_address);
    $user_agent = mysqli_real_escape_string($con, $user_agent);

    // INSERT QUERY
    $query = "INSERT INTO audit_logs (user_id, action, table_name, record_id, old_values, new_values, ip_address, user_agent, created_at) VALUES ('$user_id', '$action', '$table_name', '$record_id', '$old_values', '$new_values', '$ip_address', '$user_agent', NOW())";

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
