<?php

$con=mysqli_connect('localhost','root','','web_project');

if(!$con){
    die(mysqli_error($con));
}

if($con){
    echo "connected successful";
}





?>