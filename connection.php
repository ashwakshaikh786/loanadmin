<?php 
$host = "a2nlmysql51plsk.secureserver.net";
$db = "loanadmin";
$user = "loanadmin";
$pass = "4yb20I^f5";
$conn = mysqli_connect($host, $user, $pass, $db);

if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}