<?php
$host = "localhost";         // Hoặc tên host khác nếu bạn dùng hosting
$username = "root";          // Tài khoản MySQL của bạn
$password = "";              // Mật khẩu nếu có
$database = "whalexe";       // Tên database của bạn

$conn = new mysqli($host, $username, $password, $database);

// Kiểm tra kết nối
if ($conn->connect_error) {
    die("Kết nối CSDL thất bại: " . $conn->connect_error);
}
?>
