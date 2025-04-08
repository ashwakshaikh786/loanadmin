<?php
// Set the default timezone
date_default_timezone_set('Asia/Kolkata');

// Allow only POST requests
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

// Set CORS headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Include database connection file
include_once '../connection.php';

// Check database connection
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

// Get raw JSON input
$inputData = json_decode(file_get_contents("php://input"), true);

// Validate required fields
if (!isset($inputData['name'])) {
    http_response_code(400); // Bad Request
    echo json_encode([
        "code" => 400,
        "status" => "Error",
        "data" => null,
        "message" => "Missing required fields"
    ]);
    exit();
}

// Prepare SQL statement
$sql = "INSERT INTO test (name) VALUES (?)";

$stmt = $conn->prepare($sql);

if ($stmt) {
    // Bind parameters
    $stmt->bind_param("s", $inputData['name']); // 's' means the type is string (VARCHAR)

    // Execute statement
    if ($stmt->execute()) {
        http_response_code(200); // Created
        echo json_encode([
            "code" => 200,
            "status" => "Success",
            "data" => NULL,
            "message" => "Record inserted successfully"
        ]);
    } else {
        http_response_code(500); // Internal Server Error
        echo json_encode([
            "code" => 500,
            "status" => "Error",
            "data" => null,
            "message" => "Error inserting record: " . $stmt->error
        ]);
    }

    $stmt->close();
} else {
    http_response_code(500); // Internal Server Error
    echo json_encode([
        "code" => 500,
        "status" => "Error",
        "data" => null,
        "message" => "Error: " . $conn->error
    ]);
}

// Close database connection
$conn->close();
?>
