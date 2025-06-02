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
        'error' => 'Database connection failed: ' . $e->getMessage()
    ]);
    exit;
}

// Handle password update POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    
    // Check if JSON decoding failed
    if (json_last_error() !== JSON_ERROR_NONE) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => 'Invalid JSON data: ' . json_last_error_msg()
        ]);
        exit;
    }
    
    // Check for required fields (consistent with register.php)
    if (!isset($data['phone_number']) || !isset($data['password'])) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => 'Missing required fields: phone_number and password'
        ]);
        exit;
    }

    // Clean input data
    $phone_number = trim($data['phone_number']);
    $new_password = trim($data['password']);
    $username = isset($data['username']) ? trim($data['username']) : null;

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

    // Validate phone number format (consistent with register.php)
    if (!preg_match('/^[+]?\d{10,15}$/', $phone_number)) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => 'Invalid phone number format'
        ]);
        exit;
    }

    try {
        // Hash the new password (consistent with register.php)
        $hashedPassword = password_hash($new_password, PASSWORD_BCRYPT);

        // Update the password using phone_number as primary identifier
        // (consistent with register.php's approach)
        $update_stmt = $pdo->prepare("UPDATE accounts SET password = ? WHERE phone_number = ?");
        $result = $update_stmt->execute([$hashedPassword, $phone_number]);

        if ($result && $update_stmt->rowCount() > 0) {
            // Fetch updated user data (consistent with register.php response format)
            $userStmt = $pdo->prepare("SELECT account_id, username, phone_number FROM accounts WHERE phone_number = ?");
            $userStmt->execute([$phone_number]);
            $updatedUser = $userStmt->fetch(PDO::FETCH_ASSOC);

            echo json_encode([
                'success' => true,
                'message' => 'Password updated successfully',
                'user' => $updatedUser
            ]);
        } else {
            echo json_encode([
                'success' => false,
                'error' => 'Failed to update password. Phone number not found or password unchanged.'
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