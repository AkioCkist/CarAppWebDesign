<?php
include 'db_connect.php';

$userId = $_GET['user_id'] ?? null;

if (!$userId) {
  echo json_encode(['error' => 'Missing user_id']);
  exit;
}

$stmt = $conn->prepare("SELECT username AS fullName, phone_number AS phone FROM accounts WHERE account_id = ?");
$stmt->bind_param("i", $userId);
$stmt->execute();
$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {
  echo json_encode($row);
} else {
  echo json_encode(['error' => 'User not found']);
}
?>
