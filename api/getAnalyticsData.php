<?php
header('Content-Type: application/json');

// Connect to DB
$conn = new mysqli("localhost", "username", "password", "database");
if ($conn->connect_error) {
    die(json_encode([]));
}

// Get days parameter
$days = isset($_GET['days']) ? (int)$_GET['days'] : 7;

// Example: user roles count
$userRoles = $conn->query("SELECT role, COUNT(*) as count FROM users GROUP BY role")->fetch_all(MYSQLI_ASSOC);

// Platform usage
$platformUsage = $conn->query("SELECT platform, COUNT(*) as count FROM user_activity WHERE date >= CURDATE() - INTERVAL $days DAY GROUP BY platform")->fetch_all(MYSQLI_ASSOC);

// Activity trends
$activityTrends = $conn->query("SELECT DATE(date) as date, COUNT(*) as activity_count FROM user_activity WHERE date >= CURDATE() - INTERVAL $days DAY GROUP BY DATE(date)")->fetch_all(MYSQLI_ASSOC);

// Top communities
$topCommunities = $conn->query("SELECT name, member_count FROM communities ORDER BY member_count DESC LIMIT 5")->fetch_all(MYSQLI_ASSOC);

// Output JSON
echo json_encode([
    'userRoles' => $userRoles,
    'platformUsage' => $platformUsage,
    'activityTrends' => $activityTrends,
    'topCommunities' => $topCommunities
]);
