-- phpMyAdmin SQL Dump (Fixed Version)
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: May 31, 2025 at 09:17 AM
-- Server version: 8.0.30
-- PHP Version: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `whalexe`
--

-- --------------------------------------------------------
-- STEP 1: CREATE ALL TABLES WITHOUT FOREIGN KEY CONSTRAINTS
-- --------------------------------------------------------

--
-- Table structure for table `accounts`
--

CREATE TABLE IF NOT EXISTS `accounts` (
  `account_id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `phone_number` varchar(20) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`account_id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `phone_number` (`phone_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE IF NOT EXISTS `roles` (
  `role_id` int NOT NULL AUTO_INCREMENT,
  `role_name` varchar(50) NOT NULL,
  PRIMARY KEY (`role_id`),
  UNIQUE KEY `role_name` (`role_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `account_roles`
--

CREATE TABLE IF NOT EXISTS `account_roles` (
  `account_id` int NOT NULL,
  `role_id` int NOT NULL,
  PRIMARY KEY (`account_id`,`role_id`),
  KEY `role_id` (`role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `vehicles`
--

CREATE TABLE IF NOT EXISTS `vehicles` (
  `vehicle_id` INT NOT NULL AUTO_INCREMENT,
  `lessor_id` INT NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `image_url` TEXT,
  `rating` DECIMAL(2,1) DEFAULT 0,
  `total_trips` INT DEFAULT 0,
  `location` TEXT NOT NULL,
  `transmission` VARCHAR(50),
  `seats` INT,
  `fuel_type` VARCHAR(50),
  `base_price` DECIMAL(10,2) NOT NULL,
  `vehicle_type` VARCHAR(50),
  `description` TEXT,
  `status` ENUM('available', 'rented', 'maintenance', 'inactive') DEFAULT 'available',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`vehicle_id`),
  KEY `lessor_id` (`lessor_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `vehicle_images`
--

CREATE TABLE IF NOT EXISTS `vehicle_images` (
  `image_id` INT NOT NULL AUTO_INCREMENT,
  `vehicle_id` INT NOT NULL,
  `image_url` TEXT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`image_id`),
  KEY `vehicle_id` (`vehicle_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `vehicle_amenities`
--

CREATE TABLE IF NOT EXISTS `vehicle_amenities` (
  `amenity_id` INT NOT NULL AUTO_INCREMENT,
  `amenity_name` VARCHAR(50) NOT NULL,
  `amenity_icon` VARCHAR(50),
  `description` TEXT,
  PRIMARY KEY (`amenity_id`),
  UNIQUE KEY `amenity_name` (`amenity_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `vehicle_amenity_mapping`
--

CREATE TABLE IF NOT EXISTS `vehicle_amenity_mapping` (
  `vehicle_id` INT NOT NULL,
  `amenity_id` INT NOT NULL,
  PRIMARY KEY (`vehicle_id`, `amenity_id`),
  KEY `amenity_id` (`amenity_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `bookings`
--

CREATE TABLE IF NOT EXISTS `bookings` (
  `booking_id` INT NOT NULL AUTO_INCREMENT,
  `vehicle_id` INT NOT NULL,
  `renter_id` INT NOT NULL,
  `pickup_date` DATE NOT NULL,
  `pickup_time` TIME NOT NULL,
  `return_date` DATE NOT NULL,
  `return_time` TIME NOT NULL,
  `pickup_location` TEXT NOT NULL,
  `return_location` TEXT NOT NULL,
  `total_price` DECIMAL(10,2) NOT NULL,
  `discount_applied` DECIMAL(10,2) DEFAULT 0,
  `final_price` DECIMAL(10,2) NOT NULL,
  `status` ENUM('pending', 'confirmed', 'ongoing', 'completed', 'cancelled') DEFAULT 'pending',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`booking_id`),
  KEY `vehicle_id` (`vehicle_id`),
  KEY `renter_id` (`renter_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------
-- STEP 2: INSERT DATA INTO ALL TABLES
-- --------------------------------------------------------

--
-- Insert data for table `roles`
--
INSERT INTO `roles` (`role_id`, `role_name`) VALUES
(1, 'renter'),
(2, 'lessor'),
(3, 'administrator')
ON DUPLICATE KEY UPDATE role_name = VALUES(role_name);

--
-- Insert data for table `accounts`
--
INSERT INTO `accounts` (`account_id`, `username`, `phone_number`, `password`, `created_at`) VALUES
(1, 'abc', '0982742410', '11223344', '2025-05-28 15:48:03'),
(2, 'cac', '0123456789', '0123456789', '2025-05-29 02:08:53'),
(3, 'lessor1', '0987654321', 'lessorpass123', '2025-05-30 10:00:00')
ON DUPLICATE KEY UPDATE 
  username = VALUES(username),
  phone_number = VALUES(phone_number),
  password = VALUES(password),
  created_at = VALUES(created_at);

--
-- Insert data for table `account_roles`
--
INSERT INTO `account_roles` (`account_id`, `role_id`) VALUES
(1, 1),
(2, 1),
(3, 2)
ON DUPLICATE KEY UPDATE role_id = VALUES(role_id);

--
-- Insert data for table `vehicles`
--
INSERT INTO `vehicles` (`vehicle_id`, `lessor_id`, `name`, `image_url`, `rating`, `total_trips`, `location`, `transmission`, `seats`, `fuel_type`, `base_price`, `vehicle_type`, `description`, `status`, `created_at`, `updated_at`) VALUES
(1, 3, 'Toyota Vios 2023', 'https://example.com/car1.jpg', 4.8, 125, 'TP.HCM - 456 Lê Văn Sỹ, Phường 14, Quận 3', 'Số tự động', 4, 'Xăng', 900000.00, 'sedan', 'Xe gia đình tiết kiệm nhiên liệu, phù hợp cho di chuyển trong thành phố và du lịch ngắn ngày.', 'available', '2025-05-01 08:00:00', '2025-05-31 09:00:00'),
(2, 3, 'Honda CR-V 2024', 'https://example.com/car2.jpg', 4.9, 180, 'Hà Nội - 789 Đại Cồ Việt, Hai Bà Trưng, Hà Nội', 'Số tự động', 7, 'Xăng', 1500000.00, 'suv', 'SUV rộng rãi, phù hợp cho gia đình và du lịch xa.', 'rented', '2025-05-02 09:00:00', '2025-05-31 10:00:00'),
(3, 3, 'Kia Morning 2022', 'https://example.com/car3.jpg', 4.5, 200, 'Đà Nẵng - 123 Nguyễn Văn Linh, Cẩm Lệ, Đà Nẵng', 'Số sàn', 4, 'Xăng', 500000.00, 'hatchback', 'Xe nhỏ gọn, tiết kiệm, lý tưởng cho di chuyển nội đô.', 'available', '2025-05-03 07:00:00', '2025-05-31 08:00:00'),
(4, 3, 'Mazda CX-5 2023', 'https://example.com/car4.jpg', 4.7, 150, 'Cần Thơ - 321 Trần Hưng Đạo, Ninh Kiều, Cần Thơ', 'Số tự động', 5, 'Xăng', 1200000.00, 'crossover', 'Xe crossover mạnh mẽ, phong cách, phù hợp mọi địa hình.', 'maintenance', '2025-05-04 06:00:00', '2025-05-31 07:00:00'),
(5, 3, 'Ford Ranger 2024', 'https://example.com/car5.jpg', 4.6, 90, 'Vũng Tàu - 987 Hạ Long, Phường 2, Vũng Tàu', 'Số tự động', 5, 'Dầu', 1800000.00, 'pickup', 'Xe bán tải mạnh mẽ, phù hợp cho công việc và du lịch địa hình.', 'available', '2025-05-05 05:00:00', '2025-05-31 06:00:00')
ON DUPLICATE KEY UPDATE 
  lessor_id = VALUES(lessor_id),
  name = VALUES(name),
  image_url = VALUES(image_url),
  rating = VALUES(rating),
  total_trips = VALUES(total_trips),
  location = VALUES(location),
  transmission = VALUES(transmission),
  seats = VALUES(seats),
  fuel_type = VALUES(fuel_type),
  base_price = VALUES(base_price),
  vehicle_type = VALUES(vehicle_type),
  description = VALUES(description),
  status = VALUES(status),
  created_at = VALUES(created_at),
  updated_at = VALUES(updated_at);

--
-- Insert data for table `vehicle_images`
--
INSERT INTO `vehicle_images` (`vehicle_id`, `image_url`, `created_at`) VALUES
(1, 'https://example.com/car1_1.jpg', '2025-05-01 08:00:00'),
(1, 'https://example.com/car1_2.jpg', '2025-05-01 08:00:00'),
(1, 'https://example.com/car1_3.jpg', '2025-05-01 08:00:00'),
(2, 'https://example.com/car2_1.jpg', '2025-05-02 09:00:00'),
(2, 'https://example.com/car2_2.jpg', '2025-05-02 09:00:00'),
(3, 'https://example.com/car3_1.jpg', '2025-05-03 07:00:00'),
(4, 'https://example.com/car4_1.jpg', '2025-05-04 06:00:00'),
(4, 'https://example.com/car4_2.jpg', '2025-05-04 06:00:00'),
(5, 'https://example.com/car5_1.jpg', '2025-05-05 05:00:00')
ON DUPLICATE KEY UPDATE 
  image_url = VALUES(image_url),
  created_at = VALUES(created_at);

--
-- Insert data for table `vehicle_amenities`
--
INSERT INTO `vehicle_amenities` (`amenity_name`, `amenity_icon`, `description`) VALUES
('bluetooth', 'bluetooth', 'Kết nối Bluetooth'),
('camera', 'camera', 'Camera lùi'),
('airbag', 'airbag', 'Túi khí an toàn'),
('etc', 'etc', 'Hệ thống thu phí tự động'),
('sunroof', 'sunroof', 'Cửa sổ trời'),
('sportMode', 'sportMode', 'Chế độ lái thể thao'),
('tablet', 'tablet', 'Màn hình giải trí'),
('camera360', 'camera360', 'Camera toàn cảnh 360 độ'),
('map', 'map', 'Hệ thống định vị GPS'),
('rotateCcw', 'rotateCcw', 'Hỗ trợ lùi xe tự động'),
('circle', 'circle', 'Cảm biến va chạm'),
('package', 'package', 'Khoang hành lý rộng'),
('shield', 'shield', 'Hệ thống chống trộm'),
('radar', 'radar', 'Cảnh báo điểm mù')
ON DUPLICATE KEY UPDATE 
  amenity_icon = VALUES(amenity_icon),
  description = VALUES(description);

--
-- Insert data for table `vehicle_amenity_mapping`
--
INSERT INTO `vehicle_amenity_mapping` (`vehicle_id`, `amenity_id`) VALUES
(1, 1), (1, 2), (1, 3), (1, 5), (1, 7),
(2, 1), (2, 2), (2, 3), (2, 5), (2, 7), (2, 8),
(3, 1), (3, 2), (3, 9),
(4, 1), (4, 2), (4, 3), (4, 8), (4, 11),
(5, 1), (5, 3), (5, 12), (5, 13), (5, 14)
ON DUPLICATE KEY UPDATE amenity_id = VALUES(amenity_id);

--
-- Insert data for table `bookings`
--
INSERT INTO `bookings` (`booking_id`, `vehicle_id`, `renter_id`, `pickup_date`, `pickup_time`, `return_date`, `return_time`, `pickup_location`, `return_location`, `total_price`, `discount_applied`, `final_price`, `status`, `created_at`, `updated_at`) VALUES
(1, 1, 1, '2025-06-15', '09:00:00', '2025-06-17', '18:00:00', 'TP.HCM - 456 Lê Văn Sỹ, Phường 14, Quận 3', 'TP.HCM - 456 Lê Văn Sỹ, Phường 14, Quận 3', 1800000.00, 270000.00, 1530000.00, 'confirmed', '2025-06-01 10:30:00', '2025-06-01 10:30:00'),
(2, 2, 2, '2025-05-20', '08:00:00', '2025-05-25', '17:00:00', 'Hà Nội - 789 Đại Cồ Việt, Hai Bà Trưng, Hà Nội', 'Hà Nội - 789 Đại Cồ Việt, Hai Bà Trưng, Hà Nội', 7500000.00, 1500000.00, 6000000.00, 'completed', '2025-05-10 09:00:00', '2025-05-25 17:00:00'),
(3, 3, 1, '2025-06-01', '10:00:00', '2025-06-02', '10:00:00', 'Đà Nẵng - 123 Nguyễn Văn Linh, Cẩm Lệ, Đà Nẵng', 'Đà Nẵng - 123 Nguyễn Văn Linh, Cẩm Lệ, Đà Nẵng', 500000.00, 50000.00, 450000.00, 'ongoing', '2025-05-25 08:00:00', '2025-05-31 10:00:00'),
(4, 4, 2, '2025-07-01', '14:00:00', '2025-07-03', '14:00:00', 'Cần Thơ - 321 Trần Hưng Đạo, Ninh Kiều, Cần Thơ', 'Cần Thơ - 321 Trần Hưng Đạo, Ninh Kiều, Cần Thơ', 2400000.00, 360000.00, 2040000.00, 'pending', '2025-06-20 12:00:00', '2025-06-20 12:00:00'),
(5, 5, 1, '2025-05-15', '07:00:00', '2025-05-17', '19:00:00', 'Vũng Tàu - 987 Hạ Long, Phường 2, Vũng Tàu', 'Vũng Tàu - 987 Hạ Long, Phường 2, Vũng Tàu', 3600000.00, 900000.00, 2700000.00, 'completed', '2025-05-01 15:00:00', '2025-05-17 19:00:00'),
(6, 1, 2, '2025-06-20', '11:00:00', '2025-06-21', '11:00:00', 'TP.HCM - 456 Lê Văn Sỹ, Phường 14, Quận 3', 'TP.HCM - 456 Lê Văn Sỹ, Phường 14, Quận 3', 900000.00, 90000.00, 810000.00, 'confirmed', '2025-06-10 14:00:00', '2025-06-10 14:00:00'),
(7, 2, 1, '2025-06-10', '09:00:00', '2025-06-12', '18:00:00', 'Hà Nội - 789 Đại Cồ Việt, Hai Bà Trưng, Hà Nội', 'Hà Nội - 789 Đại Cồ Việt, Hai Bà Trưng, Hà Nội', 3000000.00, 300000.00, 2700000.00, 'cancelled', '2025-06-01 11:00:00', '2025-06-05 09:00:00'),
(8, 3, 2, '2025-07-05', '08:00:00', '2025-07-07', '17:00:00', 'Đà Nẵng - 123 Nguyễn Văn Linh, Cẩm Lệ, Đà Nẵng', 'Đà Nẵng - 123 Nguyễn Văn Linh, Cẩm Lệ, Đà Nẵng', 1000000.00, 100000.00, 900000.00, 'pending', '2025-06-25 10:00:00', '2025-06-25 10:00:00'),
(9, 4, 1, '2025-06-25', '12:00:00', '2025-06-30', '12:00:00', 'Cần Thơ - 321 Trần Hưng Đạo, Ninh Kiều, Cần Thơ', 'Cần Thơ - 321 Trần Hưng Đạo, Ninh Kiều, Cần Thơ', 6000000.00, 1200000.00, 4800000.00, 'confirmed', '2025-06-15 13:00:00', '2025-06-15 13:00:00'),
(10, 5, 2, '2025-06-01', '15:00:00', '2025-06-03', '15:00:00', 'Vũng Tàu - 987 Hạ Long, Phường 2, Vũng Tàu', 'Vũng Tàu - 987 Hạ Long, Phường 2, Vũng Tàu', 3600000.00, 900000.00, 2700000.00, 'ongoing', '2025-05-20 16:00:00', '2025-05-31 16:00:00')
ON DUPLICATE KEY UPDATE 
  vehicle_id = VALUES(vehicle_id),
  renter_id = VALUES(renter_id),
  pickup_date = VALUES(pickup_date),
  pickup_time = VALUES(pickup_time),
  return_date = VALUES(return_date),
  return_time = VALUES(return_time),
  pickup_location = VALUES(pickup_location),
  return_location = VALUES(return_location),
  total_price = VALUES(total_price),
  discount_applied = VALUES(discount_applied),
  final_price = VALUES(final_price),
  status = VALUES(status),
  created_at = VALUES(created_at),
  updated_at = VALUES(updated_at);

-- --------------------------------------------------------
-- STEP 3: ADD FOREIGN KEY CONSTRAINTS
-- --------------------------------------------------------

-- Add foreign key constraints for account_roles
ALTER TABLE `account_roles`
  ADD CONSTRAINT `fk_account_roles_account` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`account_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_account_roles_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`) ON DELETE CASCADE;

-- Add foreign key constraints for vehicles
ALTER TABLE `vehicles`
  ADD CONSTRAINT `fk_vehicles_lessor` FOREIGN KEY (`lessor_id`) REFERENCES `accounts` (`account_id`) ON DELETE CASCADE;

-- Add foreign key constraints for vehicle_images
ALTER TABLE `vehicle_images`
  ADD CONSTRAINT `fk_vehicle_images_vehicle` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles` (`vehicle_id`) ON DELETE CASCADE;

-- Add foreign key constraints for vehicle_amenity_mapping
ALTER TABLE `vehicle_amenity_mapping`
  ADD CONSTRAINT `fk_vehicle_amenity_vehicle` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles` (`vehicle_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_vehicle_amenity_amenity` FOREIGN KEY (`amenity_id`) REFERENCES `vehicle_amenities` (`amenity_id`) ON DELETE CASCADE;

-- Add foreign key constraints for bookings
ALTER TABLE `bookings`
  ADD CONSTRAINT `fk_bookings_vehicle` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles` (`vehicle_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_bookings_renter` FOREIGN KEY (`renter_id`) REFERENCES `accounts` (`account_id`) ON DELETE CASCADE;

-- --------------------------------------------------------
-- STEP 4: CREATE TRIGGER
-- --------------------------------------------------------

--
-- Drop existing trigger if exists and recreate
--
DROP TRIGGER IF EXISTS `after_account_insert`;
DELIMITER $$
CREATE TRIGGER `after_account_insert` AFTER INSERT ON `accounts` FOR EACH ROW BEGIN
  INSERT INTO account_roles (account_id, role_id)
  VALUES (NEW.account_id, 1); -- Gán mặc định là 'renter'
END
$$
DELIMITER ;

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;