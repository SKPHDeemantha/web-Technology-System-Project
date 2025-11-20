<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

include '../connect.php';

// Check connection
if (!$con) {
    die(json_encode(array('error' => 'Database connection failed: ' . mysqli_connect_error())));
}

$query = "
    SELECT 
        al.action,
        al.created_at,
        u.display_name as user,
        ur.role_name as role
    FROM audit_logs al
    LEFT JOIN users u ON al.user_id = u.id
    LEFT JOIN user_roles ur ON u.role_id = ur.id
    ORDER BY al.created_at DESC
";

$result = mysqli_query($con, $query);

// Check if query was successful
if (!$result) {
    die(json_encode(array('error' => 'Query failed: ' . mysqli_error($con))));
}

$logs = array(); // Changed from [] to array()
while ($row = mysqli_fetch_assoc($result)) {
    $logs[] = $row; // This [] is fine in newer PHP versions, but let's be consistent
}

// If no logs found, return empty array instead of nothing
if (empty($logs)) {
    $logs = array(); // Changed from [] to array()
}

// Close connection
mysqli_close($con);

// Set proper headers and output
header('Content-Type: application/json; charset=utf-8');
echo json_encode($logs);

// Make sure nothing else is output
exit();
?>