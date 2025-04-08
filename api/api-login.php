<?php
// Ensure that only POST requests are allowed
date_default_timezone_set('Asia/Kolkata');
// Check if the request method is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405); // Method Not Allowed
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

// Include database connection file
include_once '../connection.php';

// Check if the connection to the database is successful
if ($conn->connect_error) {
    http_response_code(500); // Internal Server Error
    echo json_encode([
        "code" => 500,
        "status" => "Error",
        "data" => null,
        "message" => "Connection failed: " . $conn->connect_error
    ]);
    exit();
}

// Get JSON input data
$data = json_decode(file_get_contents("php://input"));
error_log("Received Data: " . json_encode($data));

// Validate presence of required fields (either mobile or username and password)
if ((!isset($data->mobile) || empty($data->mobile)) && !isset($data->password) || empty($data->password)) {
    http_response_code(400); // Bad Request
    echo json_encode([
        "code" => 400,
        "status" => "Error",
        "data" => null,
        "message" => "Missing mobile or password."
    ]);
    exit();
}

// Sanitize and validate mobile or username
$mobile = isset($data->mobile) ? htmlspecialchars(trim($data->mobile)) : '';
$password = trim($data->password);

// Prepare the SQL query to find the user by mobile or username
$query = "SELECT user_id,first_name, last_name, username , password, address,email,mobile,role_id, dob, is_active, created_at, created_uid FROM Adminusers WHERE username = ?";
 $date = date('Y-m-d H:i:s') ;

$stmt= $conn->prepare($query);

// Bind parameters (either mobile or username)
$stmt->bind_param("s", $mobile);
$stmt->execute();
$stmt->store_result();

// Check if a user was found
if ($stmt->num_rows == 0) {
    http_response_code(401); // Unauthorized
    echo json_encode([
        "code" => 401,
        "status" => "Error",
        "data" => null,
        "message" => "Invalid mobile or password."
    ]);
    exit();
}

// Fetch user data
$stmt->bind_result($user_id, $first_name, $last_name, $username $password, $address ,$email,$mobile,$role_id,$dob,$is_active,$created_at,$created_uid);
$stmt->fetch();

// Check if the account is active
if ($is_active != 1) {
    http_response_code(401); // Unauthorized
    echo json_encode([
        "code" => 401,
        "status" => "Error",
        "data" => null,
        "message" => "Account is inactive."
    ]);
    exit();
}

// Verify the password
if (!password_verify($password, $hashed_password)) {
    http_response_code(401); // Unauthorized
    echo json_encode([
        "code" => 401,
        "status" => "Error",
        "data" => null,
        "message" => "Invalid mobile or password."
    ]);
    exit();
}

// Return success response with username
http_response_code(200);
echo json_encode([
    "code" => 200,
    "status" => "Success",
    "data" => [
        "mobile" => $db_mobile,
        "username" => $firstname . " " . $lastname,  
        "is_first_deposit_done" => $firstdeposit,
        "user_id" => $user_id
    ],
    "message" => "Login successful."
]);

$stmt->close();
$conn->close();
?>
