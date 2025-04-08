<?php
// Allow CORS (Cross-Origin Resource Sharing)
header("Access-Control-Allow-Origin: *");  // This allows all origins. For production, change * to the actual front-end URL.
header("Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE");  // Allow specific HTTP methods
header("Access-Control-Allow-Headers: Content-Type, Authorization");  // Allow necessary headers

// Handle pre-flight request (OPTIONS method)
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    header("HTTP/1.1 200 OK");
    exit();
}

// Database connection
$host = "a2nlmysql51plsk.secureserver.net";
$db = "dmin"; 
$user = "dmin"; 
$pass = "4yb222^f5"; 

// Establishing connection
$conn = mysqli_connect($host, $user, $pass, $db);

if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}
?>
