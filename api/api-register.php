<?php

date_default_timezone_set('Asia/Kolkata');
// Check if the request method is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405); 
    echo json_encode([
        "code" => 405,
        "status" => "Error",
        "data" => null,
        "message" => "Method Not Allowed"
    ]);
    exit();
}

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

include_once '../connection.php';

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode([ 
        "code" => 500,
        "status" => "Error",
        "data" => null,
        "message" => "Connection failed: " . $conn->connect_error
    ]);
    exit();
}

$data = json_decode(file_get_contents("php://input"));

// Validation for required fields
if (
    !isset($data->mobile) || empty($data->mobile) ||
    !isset($data->password) || empty($data->password) ||
    !isset($data->first_name) || empty($data->first_name) ||
    !isset($data->last_name) || empty($data->last_name)
) {
    http_response_code(400);
    echo json_encode([ 
        "code" => 400,
        "status" => "Error",
        "data" => null,
        "message" => "Missing required fields."
    ]);
    exit();
}

$mobile = htmlspecialchars(trim($data->mobile));
$first_name = htmlspecialchars(trim($data->first_name));
$last_name = htmlspecialchars(trim($data->last_name));

// Check if the mobile number already exists
 $date = date('Y-m-d H:i:s') ;

$stmt= $conn->prepare("SELECT COUNT(*) FROM users WHERE mobile = ?");
$stmt->bind_param("s", $mobile);
$stmt->execute();
$stmt->bind_result($count);
$stmt->fetch();
$stmt->close();

if ($count > 0) {
    http_response_code(400);
    echo json_encode([ 
        "code" => 400,
        "status" => "Error",
        "data" => null,
        "message" => "Mobile number already exists."
    ]);
    exit();
}

$hashedPassword = password_hash($data->password, PASSWORD_BCRYPT);

 $date = date('Y-m-d H:i:s') ;

$stmt= $conn->prepare("INSERT INTO Adminusers (user_id,first_name, last_name, username , password, address,email,mobile,role_id, dob, is_active, created_at, created_uid) VALUES (?,?,?,?,?,?,?,?,?,?,?)");

$createUid = 1; 
$isActive = 1; 
$firsdtdeposit = 0;
$stmt->bind_param("sssssssssss", 
$user_id,
$first_name,
$last_name,
$username,
$password, 
$address,
$email,
$mobile,
$role_id,
$dob,
$is_active,
$created_at,
$created_uid
);

if ($stmt->execute()) {
    // Fetch the last inserted user ID
    $user_id = $conn->insert_id;
    
    http_response_code(200); 
    echo json_encode([ 
        "code" => 200,
        "status" => "Success",
        "data" => [
            "user_id" => $user_id,
            "mobile" => $mobile,
            "username" => $first_name . " " . $last_name,
            "is_first_deposit_done" => $firsdtdeposit
        ],
        "message" => "User registered successfully."
    ]);
} else {
    http_response_code(500); 
    echo json_encode([ 
        "code" => 500,
        "status" => "Error",
        "data" => null,
        "message" => "Error: " . $stmt->error
    ]);
}

$stmt->close();
$conn->close();

?>
