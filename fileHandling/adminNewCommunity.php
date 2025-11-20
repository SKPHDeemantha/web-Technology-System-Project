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
    if(!isset($_POST['name']) || !isset($_POST['description']) || !isset($_POST['category'])) {
        echo "0";
        exit();
    }

    // Get POST data
    $name = trim($_POST['name']);
    $description = trim($_POST['description']);
    $category = $_POST['category'];

    // Validate input
    if(empty($name) || empty($category)) {
        echo "0";
        exit();
    }

    // ESCAPE (SQL Injection protection)
    $name = mysqli_real_escape_string($con, $name);
    $description = mysqli_real_escape_string($con, $description);
    $category = mysqli_real_escape_string($con, $category);
    $created_by = $_SESSION['user_id'];

    // Check if community name already exists
    $check_query = "SELECT id FROM communities WHERE name = '$name'";
    $check_result = mysqli_query($con, $check_query);
    if(mysqli_num_rows($check_result) > 0) {
        echo "0"; // Community name already exists
        exit();
    }

    // INSERT QUERY
    $query = "INSERT INTO communities (name, description, category, created_by, is_active, created_at, updated_at) VALUES ('$name', '$description', '$category', $created_by, 1, NOW(), NOW())";

    $result = mysqli_query($con, $query);

    if ($result) {
        $community_id = mysqli_insert_id($con);
        
        // Prepare values for audit log
        $new_values = json_encode(array(
            'name' => $name, 
            'description' => $description, 
            'category' => $category, 
            'created_by' => $created_by, 
            'status' => 1
        ));
        
        // Log activity
        $log_query = "
            INSERT INTO audit_logs
            (user_id, action, table_name, record_id, old_values, new_values, ip_address, user_agent, created_at)
            VALUES
            ({$_SESSION['user_id']}, 'Create community \"$name\"', 'communities', $community_id, '', '$new_values', '{$_SERVER['REMOTE_ADDR']}', '{$_SERVER['HTTP_USER_AGENT']}', NOW())
        ";
        mysqli_query($con, $log_query);
        echo "1";
    } else {
        echo "0";
    }

    exit();

} else if ($id == "update") {
    // Validate required fields
    if(!isset($_POST['community_id']) || !isset($_POST['name']) || !isset($_POST['description']) || !isset($_POST['category']) || !isset($_POST['status'])) {
        echo "0";
        exit();
    }

    // Get POST data
    $community_id = intval($_POST['community_id']);
    $name = trim($_POST['name']);
    $description = trim($_POST['description']);
    $category = $_POST['category'];
    $status = intval($_POST['status']);

    // Validate input
    if(empty($community_id) || empty($name) || empty($category)) {
        echo "0";
        exit();
    }

    // ESCAPE (SQL Injection protection)
    $name = mysqli_real_escape_string($con, $name);
    $description = mysqli_real_escape_string($con, $description);
    $category = mysqli_real_escape_string($con, $category);

    // Check if community name already exists for other communities
    $check_query = "SELECT id FROM communities WHERE name = '$name' AND id != $community_id";
    $check_result = mysqli_query($con, $check_query);
    if(mysqli_num_rows($check_result) > 0) {
        echo "0"; // Community name already exists for another community
        exit();
    }

    // Get old values for audit log
    $old_query = "SELECT name, description, category, is_active FROM communities WHERE id = $community_id";
    $old_result = mysqli_query($con, $old_query);
    $old_data = mysqli_fetch_assoc($old_result);
    $old_values = json_encode($old_data);

    // UPDATE QUERY
    $query = "
        UPDATE communities SET
        name = '$name',
        description = '$description',
        category = '$category',
        is_active = $status,
        updated_at = NOW()
        WHERE id = $community_id
    ";

    $result = mysqli_query($con, $query);

    if ($result) {
        $new_values = json_encode(array(
            'name' => $name, 
            'description' => $description, 
            'category' => $category, 
            'status' => $status
        ));
        
        // Log activity
        $log_query = "
            INSERT INTO audit_logs
            (user_id, action, table_name, record_id, old_values, new_values, ip_address, user_agent, created_at)
            VALUES
            ({$_SESSION['user_id']}, 'Update community \"$name\"', 'communities', $community_id, '$old_values', '$new_values', '{$_SERVER['REMOTE_ADDR']}', '{$_SERVER['HTTP_USER_AGENT']}', NOW())
        ";
        mysqli_query($con, $log_query);
        echo "1";
    } else {
        echo "0";
    }

    exit();

} else if ($id == "delete") {
    // Validate required fields
    if(!isset($_POST['community_id'])) {
        echo "0";
        exit();
    }

    $community_id = intval($_POST['community_id']);

    // Validate input
    if(empty($community_id)) {
        echo "0";
        exit();
    }

    // Get community data for audit log before deleting
    $community_query = "SELECT name FROM communities WHERE id = $community_id";
    $community_result = mysqli_query($con, $community_query);
    
    if(mysqli_num_rows($community_result) == 0) {
        echo "0"; // Community not found
        exit();
    }
    
    $community_data = mysqli_fetch_assoc($community_result);
    $community_name = $community_data['name'];

    // Get old values for audit log
    $old_query = "SELECT * FROM communities WHERE id = $community_id";
    $old_result = mysqli_query($con, $old_query);
    $old_data = mysqli_fetch_assoc($old_result);
    $old_values = json_encode($old_data);

    // DELETE QUERY
    $query = "DELETE FROM communities WHERE id = $community_id";
    $result = mysqli_query($con, $query);

    if ($result) {
        // Log activity
        $log_query = "
            INSERT INTO audit_logs
            (user_id, action, table_name, record_id, old_values, new_values, ip_address, user_agent, created_at)
            VALUES
            ({$_SESSION['user_id']}, 'Delete community \"$community_name\"', 'communities', $community_id, '$old_values', '', '{$_SERVER['REMOTE_ADDR']}', '{$_SERVER['HTTP_USER_AGENT']}', NOW())
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