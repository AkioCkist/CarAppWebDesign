<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$host = 'localhost';
$db   = 'whalexe';
$user = 'root';
$pass = '';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Database connection failed'
    ]);
    exit;
}

// Handle password update POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get raw POST data
    $raw_data = file_get_contents("php://input");
    $data = json_decode($raw_data, true);
    
    // Debug: Log what we received
    error_log("Update Password - Raw POST data: " . $raw_data);
    error_log("Update Password - Decoded data: " . print_r($data, true));
    
    // Check if JSON decoding failed
    if (json_last_error() !== JSON_ERROR_NONE) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => 'Invalid JSON data: ' . json_last_error_msg(),
            'raw_data' => $raw_data
        ]);
        exit;
    }
    
    // Check if data is null or empty
    if (!$data) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => 'No data received',
            'raw_data' => $raw_data
        ]);
        exit;
    }

    // Check for required fields (matching the pattern from forgot_password.php)
    if (!isset($data['username']) || !isset($data['phone_number']) || !isset($data['new_password'])) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => 'Missing required fields: username, phone_number, and new_password',
            'received_fields' => array_keys($data),
            'received_data' => $data
        ]);
        exit;
    }

    // Clean input data
    $username = trim($data['username']);
    $phone_number = trim($data['phone_number']);
    $new_password = trim($data['new_password']);
    $user_id = isset($data['user_id']) ? trim($data['user_id']) : null;

    // Validate inputs
    if (empty($new_password)) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => 'New password cannot be empty'
        ]);
        exit;
    }

    if (strlen($new_password) < 6) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => 'Password must be at least 6 characters long'
        ]);
        exit;
    }

    // Validate phone number format
    if (!preg_match('/^[+]?[0-9]{10,13}$/', $phone_number)) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => 'Invalid phone number format'
        ]);
        exit;
    }

    try {
        // First verify the account exists using the correct column names
        $verify_stmt = $pdo->prepare("SELECT account_id FROM accounts WHERE username = ? AND phone_number = ?");
        $verify_stmt->execute([$username, $phone_number]);
        $existing_user = $verify_stmt->fetch();

        if (!$existing_user) {
            echo json_encode([
                'success' => false, 
                'error' => 'Account verification failed. Username or phone number not found.'
            ]);
            exit;
        }

        // Update the password using the correct column names
        // Note: In production, you should hash the password using password_hash()
        // For now, keeping it simple to match your existing system
        $update_stmt = $pdo->prepare("UPDATE accounts SET password = ? WHERE username = ? AND phone_number = ?");
        $result = $update_stmt->execute([$new_password, $username, $phone_number]);

        if ($result && $update_stmt->rowCount() > 0) {
            echo json_encode([
                'success' => true,
                'message' => 'Password updated successfully',
                'user_id' => $existing_user['account_id'],
                'username' => $username
            ]);
        } else {
            echo json_encode([
                'success' => false,
                'error' => 'Failed to update password. No rows affected.'
            ]);
        }

    } catch (\PDOException $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'error' => 'Database operation failed: ' . $e->getMessage()
        ]);
    }

} else {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'error' => 'Method not allowed'
    ]);
}
?>