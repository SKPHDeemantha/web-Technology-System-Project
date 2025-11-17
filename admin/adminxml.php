<?php
session_start();
header('Content-Type: text/xml');
echo "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n";
include '../connect.php';
// if(!isset($_SESSION['user_id'])){
//     header("Location: ../index.php");
//     exit();
// }

$RequestType = $_GET["request"];

if (strcmp($RequestType, "getUserCount") == 0) {
    $ResponseXML = "<XMLgetUserCount>";

    $SQL = "select count(id) as userCount from users";
    // echo $SQL;
    $result = mysqli_query($con, $SQL);
    $row = mysqli_fetch_array($result);
    $ResponseXML .= "<userCount><![CDATA[" . $row['userCount'] . "]]></userCount>\n";
    $ResponseXML .= "</XMLgetUserCount>";
    echo $ResponseXML;
} else if (strcmp($RequestType, "getCommunityCount") == 0) {
    $ResponseXML = "<XMLgetCommunityCount>";

    $SQL = "select count(id) as communityCount from communities";
    // echo $SQL;
    $result = mysqli_query($con, $SQL);
    $row = mysqli_fetch_array($result);
    $ResponseXML .= "<communityCount><![CDATA[" . $row['communityCount'] . "]]></communityCount>\n";
    $ResponseXML .= "</XMLgetCommunityCount>";
    echo $ResponseXML;
}  else if (strcmp($RequestType, "getEventCount") == 0) {
    $ResponseXML = "<XMLgetEventCount>";

    $SQL = "select count(id) as eventCount from events";
    // echo $SQL;
    $result = mysqli_query($con, $SQL);
    $row = mysqli_fetch_array($result);
    $ResponseXML .= "<eventCount><![CDATA[" . $row['eventCount'] . "]]></eventCount>\n";
    $ResponseXML .= "</XMLgetEventCount>";
    echo $ResponseXML;
}  else if (strcmp($RequestType, "getLogCount") == 0) {
    $ResponseXML = "<XMLgetLogCount>";

    $SQL = "select count(id) as logCount from audit_logs";
    // echo $SQL;
    $result = mysqli_query($con, $SQL);
    $row = mysqli_fetch_array($result);
    $ResponseXML .= "<logCount><![CDATA[" . $row['logCount'] . "]]></logCount>\n";
    $ResponseXML .= "</XMLgetLogCount>";
    echo $ResponseXML;
}  else if (strcmp($RequestType, "getUserData") == 0) {
    $ResponseXML = "<XMLgetUserData>";

    $SQL = "select * from users";
    // echo $SQL;
    $result = mysqli_query($con, $SQL);
    $count = mysqli_num_rows($result);
    $ResponseXML .= "<count><![CDATA[" . $count . "]]></count>\n";
    $rowNo=1;
    while($row = mysqli_fetch_array($result)){
        $ResponseXML .= "<rowNo><![CDATA[" . $rowNo . "]]></rowNo>\n";
        $ResponseXML .= "<userId><![CDATA[" . $row['id'] . "]]></userId>\n";
        $ResponseXML .= "<fullName><![CDATA[" . $row['display_name'] . "]]></fullName>\n";
        $ResponseXML .= "<email><![CDATA[" . $row['email'] . "]]></email>\n";
        $ResponseXML .= "<role><![CDATA[" . $row['role_id'] . "]]></role>\n";
        $ResponseXML .= "<status><![CDATA[" . $row['is_active'] . "]]></status>\n";
        $rowNo++;
    }
    $ResponseXML .= "</XMLgetUserData>";
    echo $ResponseXML;
}  



?>