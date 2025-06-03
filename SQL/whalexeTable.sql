-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jun 03, 2025 at 05:01 PM
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

--
-- Table structure for table `accounts`
--

CREATE TABLE `accounts` (
  `account_id` int NOT NULL,
  `username` varchar(50) NOT NULL,
  `phone_number` varchar(20) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `accounts`
--

INSERT INTO `accounts` (`account_id`, `username`, `phone_number`, `password`, `created_at`) VALUES
(1, 'abc', '0982742410', '$2y$10$D3doWLw7atAtnhgBrGcm7O2TvxnsqqGM0N8cASy9btdbkBisvZ5Wu', '2025-05-28 15:48:03'),
(2, 'cac', '0123456789', '$2y$10$rpqLOsIkKMDRsbkL5CvI5ehDUvsMQv4MF485lLveUgcqV/qVPpygG', '2025-05-29 02:08:53'),
(3, 'lessor1', '0987654321', '$2y$10$8Vc81s1FWpPUx/yjZgc5s./3zEPunW/lSmIJ8OSB2C3D8kaSbPml.', '2025-05-30 10:00:00');

--
-- Triggers `accounts`
--
DELIMITER $$
CREATE TRIGGER `after_account_insert` AFTER INSERT ON `accounts` FOR EACH ROW BEGIN
  INSERT INTO account_roles (account_id, role_id)
  VALUES (NEW.account_id, 1); -- Gán mặc định là 'renter'
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `account_roles`
--

CREATE TABLE `account_roles` (
  `account_id` int NOT NULL,
  `role_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `account_roles`
--

INSERT INTO `account_roles` (`account_id`, `role_id`) VALUES
(1, 1),
(2, 1),
(3, 2);

-- --------------------------------------------------------

--
-- Table structure for table `bookings`
--

CREATE TABLE `bookings` (
  `booking_id` int NOT NULL,
  `vehicle_id` int NOT NULL,
  `renter_id` int NOT NULL,
  `pickup_date` date NOT NULL,
  `pickup_time` time NOT NULL,
  `return_date` date NOT NULL,
  `return_time` time NOT NULL,
  `pickup_location` text NOT NULL,
  `return_location` text NOT NULL,
  `total_price` decimal(10,2) NOT NULL,
  `discount_applied` decimal(10,2) DEFAULT '0.00',
  `final_price` decimal(10,2) NOT NULL,
  `status` enum('pending','confirmed','ongoing','completed','cancelled') DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `bookings`
--

INSERT INTO `bookings` (`booking_id`, `vehicle_id`, `renter_id`, `pickup_date`, `pickup_time`, `return_date`, `return_time`, `pickup_location`, `return_location`, `total_price`, `discount_applied`, `final_price`, `status`, `created_at`, `updated_at`) VALUES
(1, 1, 1, '2025-06-15', '09:00:00', '2025-06-17', '18:00:00', 'TP.HCM - 456 Lê Văn Sỹ, Phường 14, Quận 3', 'TP.HCM - 456 Lê Văn Sỹ, Phường 14, Quận 3', '1800000.00', '270000.00', '1530000.00', 'confirmed', '2025-06-01 10:30:00', '2025-06-01 10:30:00'),
(2, 2, 2, '2025-05-20', '08:00:00', '2025-05-25', '17:00:00', 'Hà Nội - 123 Trần Phú, Ba Đình, Hà Nội', 'Hà Nội - 123 Trần Phú, Ba Đình, Hà Nội', '7500000.00', '1500000.00', '6000000.00', 'completed', '2025-05-10 09:00:00', '2025-05-25 17:00:00'),
(3, 3, 1, '2025-06-01', '10:00:00', '2025-06-02', '10:00:00', 'Đà Nẵng - 567 Nguyễn Văn Linh, Hải Châu, Đà Nẵng', 'Đà Nẵng - 567 Nguyễn Văn Linh, Hải Châu, Đà Nẵng', '500000.00', '50000.00', '450000.00', 'ongoing', '2025-05-25 08:00:00', '2025-05-31 10:00:00'),
(4, 4, 2, '2025-07-01', '14:00:00', '2025-07-03', '14:00:00', 'Huế - 234 Lê Lợi, Phú Hậu, Huế', 'Huế - 234 Lê Lợi, Phú Hậu, Huế', '2400000.00', '360000.00', '2040000.00', 'pending', '2025-06-20 12:00:00', '2025-06-20 12:00:00'),
(5, 5, 1, '2025-05-15', '07:00:00', '2025-05-17', '19:00:00', 'Bắc Ninh - 789 Nguyễn Trãi, Suối Hoa, Bắc Ninh', 'Bắc Ninh - 789 Nguyễn Trãi, Suối Hoa, Bắc Ninh', '3600000.00', '900000.00', '2700000.00', 'completed', '2025-05-01 15:00:00', '2025-05-17 19:00:00'),
(6, 1, 2, '2025-06-20', '11:00:00', '2025-06-21', '11:00:00', 'TP.HCM - 456 Lê Văn Sỹ, Phường 14, Quận 3', 'TP.HCM - 456 Lê Văn Sỹ, Phường 14, Quận 3', '900000.00', '90000.00', '810000.00', 'confirmed', '2025-06-10 14:00:00', '2025-06-10 14:00:00'),
(7, 2, 1, '2025-06-10', '09:00:00', '2025-06-12', '18:00:00', 'Hà Nội - 123 Trần Phú, Ba Đình, Hà Nội', 'Hà Nội - 123 Trần Phú, Ba Đình, Hà Nội', '3000000.00', '300000.00', '2700000.00', 'cancelled', '2025-06-01 11:00:00', '2025-06-05 09:00:00'),
(8, 3, 2, '2025-07-05', '08:00:00', '2025-07-07', '17:00:00', 'Đà Nẵng - 567 Nguyễn Văn Linh, Hải Châu, Đà Nẵng', 'Đà Nẵng - 567 Nguyễn Văn Linh, Hải Châu, Đà Nẵng', '1000000.00', '100000.00', '900000.00', 'pending', '2025-06-25 10:00:00', '2025-06-25 10:00:00'),
(9, 4, 1, '2025-06-25', '12:00:00', '2025-06-30', '12:00:00', 'Huế - 234 Lê Lợi, Phú Hậu, Huế', 'Huế - 234 Lê Lợi, Phú Hậu, Huế', '6000000.00', '1200000.00', '4800000.00', 'confirmed', '2025-06-15 13:00:00', '2025-06-15 13:00:00'),
(10, 5, 2, '2025-06-01', '15:00:00', '2025-06-03', '15:00:00', 'Bắc Ninh - 789 Nguyễn Trãi, Suối Hoa, Bắc Ninh', 'Bắc Ninh - 789 Nguyễn Trãi, Suối Hoa, Bắc Ninh', '3600000.00', '900000.00', '2700000.00', 'ongoing', '2025-05-20 16:00:00', '2025-05-31 16:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `role_id` int NOT NULL,
  `role_name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`role_id`, `role_name`) VALUES
(3, 'administrator'),
(2, 'lessor'),
(1, 'renter');

-- --------------------------------------------------------

--
-- Table structure for table `vehicles`
--

CREATE TABLE `vehicles` (
  `vehicle_id` int NOT NULL,
  `lessor_id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `rating` decimal(2,1) DEFAULT '0.0',
  `total_trips` int DEFAULT '0',
  `location` text NOT NULL,
  `transmission` varchar(50) DEFAULT NULL,
  `seats` int DEFAULT NULL,
  `fuel_type` varchar(50) DEFAULT NULL,
  `base_price` decimal(10,2) NOT NULL,
  `vehicle_type` varchar(50) DEFAULT NULL,
  `description` text,
  `status` enum('available','rented','maintenance','inactive') DEFAULT 'available',
  `is_favorite` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `vehicles`
--

INSERT INTO `vehicles` (`vehicle_id`, `lessor_id`, `name`, `rating`, `total_trips`, `location`, `transmission`, `seats`, `fuel_type`, `base_price`, `vehicle_type`, `description`, `status`, `is_favorite`, `created_at`, `updated_at`) VALUES
(1, 3, 'Toyota Vios 2023', '4.8', 125, 'TP.HCM - 456 Lê Văn Sỹ, Phường 14, Quận 3', 'Số tự động', 4, 'Xăng', '900000.00', 'sedan', 'Xe gia đình tiết kiệm nhiên liệu, phù hợp cho di chuyển trong thành phố và du lịch ngắn ngày.', 'available', 1, '2025-05-01 08:00:00', '2025-05-31 09:00:00'),
(2, 3, 'Honda CR-V 2024', '4.9', 180, 'Hà Nội - 123 Trần Phú, Ba Đình, Hà Nội', 'Số tự động', 7, 'Xăng', '1500000.00', 'suv', 'SUV rộng rãi, phù hợp cho gia đình và du lịch xa.', 'rented', 0, '2025-05-02 09:00:00', '2025-05-31 10:00:00'),
(3, 3, 'Kia Morning 2022', '4.5', 200, 'Đà Nẵng - 567 Nguyễn Văn Linh, Hải Châu, Đà Nẵng', 'Số sàn', 4, 'Xăng', '500000.00', 'hatchback', 'Xe nhỏ gọn, tiết kiệm, lý tưởng cho di chuyển nội đô.', 'available', 0, '2025-05-03 07:00:00', '2025-05-31 08:00:00'),
(4, 3, 'Mazda CX-5 2023', '4.7', 150, 'Huế - 234 Lê Lợi, Phú Hậu, Huế', 'Số tự động', 5, 'Xăng', '1200000.00', 'crossover', 'Xe crossover mạnh mẽ, phong cách, phù hợp mọi địa hình.', 'available', 1, '2025-05-04 06:00:00', '2025-06-02 15:14:04'),
(5, 3, 'Ford Ranger 2024', '4.6', 90, 'Bắc Ninh - 789 Nguyễn Trãi, Suối Hoa, Bắc Ninh', 'Số tự động', 5, 'Dầu', '1800000.00', 'pickup', 'Xe bán tải mạnh mẽ, phù hợp cho công việc và du lịch địa hình.', 'available', 0, '2025-05-05 05:00:00', '2025-05-31 06:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `vehicle_amenities`
--

CREATE TABLE `vehicle_amenities` (
  `amenity_id` int NOT NULL,
  `amenity_name` varchar(50) NOT NULL,
  `amenity_icon` varchar(50) DEFAULT NULL,
  `description` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `vehicle_amenities`
--

INSERT INTO `vehicle_amenities` (`amenity_id`, `amenity_name`, `amenity_icon`, `description`) VALUES
(1, 'bluetooth', 'bluetooth', 'Kết nối Bluetooth'),
(2, 'camera', 'camera', 'Camera lùi'),
(3, 'airbag', 'airbag', 'Túi khí an toàn'),
(4, 'etc', 'etc', 'Hệ thống thu phí tự động'),
(5, 'sunroof', 'sunroof', 'Cửa sổ trời'),
(6, 'sportMode', 'sportMode', 'Chế độ lái thể thao'),
(7, 'tablet', 'tablet', 'Màn hình giải trí'),
(8, 'camera360', 'camera360', 'Camera toàn cảnh 360 độ'),
(9, 'map', 'map', 'Hệ thống định vị GPS'),
(10, 'rotateCcw', 'rotateCcw', 'Hỗ trợ lùi xe tự động'),
(11, 'circle', 'circle', 'Cảm biến va chạm'),
(12, 'package', 'package', 'Khoang hành lý rộng'),
(13, 'shield', 'shield', 'Hệ thống chống trộm'),
(14, 'radar', 'radar', 'Cảnh báo điểm mù');

-- --------------------------------------------------------

--
-- Table structure for table `vehicle_amenity_mapping`
--

CREATE TABLE `vehicle_amenity_mapping` (
  `vehicle_id` int NOT NULL,
  `amenity_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `vehicle_amenity_mapping`
--

INSERT INTO `vehicle_amenity_mapping` (`vehicle_id`, `amenity_id`) VALUES
(1, 1),
(2, 1),
(3, 1),
(4, 1),
(5, 1),
(1, 2),
(2, 2),
(3, 2),
(4, 2),
(1, 3),
(2, 3),
(4, 3),
(5, 3),
(1, 5),
(2, 5),
(1, 7),
(2, 7),
(2, 8),
(4, 8),
(3, 9),
(4, 11),
(5, 12),
(5, 13),
(5, 14);

-- --------------------------------------------------------

--
-- Table structure for table `vehicle_images`
--

CREATE TABLE `vehicle_images` (
  `image_id` int NOT NULL,
  `vehicle_id` int NOT NULL,
  `image_url` text NOT NULL,
  `is_primary` tinyint(1) DEFAULT '0',
  `display_order` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `vehicle_images`
--

INSERT INTO `vehicle_images` (`image_id`, `vehicle_id`, `image_url`, `is_primary`, `display_order`, `created_at`) VALUES
(1, 1, '/cars/ToyotaVios2023/1.png', 1, 1, '2025-05-01 08:00:00'),
(2, 1, '/cars/FordRange2024/2.png', 0, 2, '2025-05-01 08:00:00'),
(3, 1, '/cars/ToyotaVios2023/3.png', 0, 3, '2025-05-01 08:00:00'),
(4, 2, 'https://example.com/car2_1.jpg', 1, 1, '2025-05-02 09:00:00'),
(5, 2, 'https://example.com/car2_2.jpg', 0, 2, '2025-05-02 09:00:00'),
(6, 3, '/cars/KiaMorning2022/1.png', 1, 1, '2025-05-03 07:00:00'),
(7, 4, '/cars/MazdaCx52023/1.png', 1, 1, '2025-05-04 06:00:00'),
(8, 4, '/cars/MazdaCx52023/2.png', 0, 2, '2025-05-04 06:00:00'),
(9, 5, '/cars/FordRange2024/1.png', 1, 1, '2025-05-05 05:00:00'),
(10, 5, '/cars/FordRange2024/2.png', 0, 2, '2025-06-03 15:44:36'),
(11, 1, '/cars/FordRange2024/1.png', 0, 4, '2025-06-03 16:48:31'),
(12, 5, '/cars/FordRange2024/3.png', 0, 3, '2025-06-03 16:52:18'),
(13, 3, '/cars/KiaMorning2022/2.png', 0, 2, '2025-06-03 17:00:20');

--
-- Triggers `vehicle_images`
--
DELIMITER $$
CREATE TRIGGER `before_vehicle_image_insert` BEFORE INSERT ON `vehicle_images` FOR EACH ROW BEGIN
  IF NEW.is_primary = TRUE THEN
    UPDATE vehicle_images SET is_primary = FALSE WHERE vehicle_id = NEW.vehicle_id;
  END IF;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `before_vehicle_image_update` BEFORE UPDATE ON `vehicle_images` FOR EACH ROW BEGIN
  IF NEW.is_primary = TRUE AND OLD.is_primary = FALSE THEN
    UPDATE vehicle_images SET is_primary = FALSE WHERE vehicle_id = NEW.vehicle_id AND image_id != NEW.image_id;
  END IF;
END
$$
DELIMITER ;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `accounts`
--
ALTER TABLE `accounts`
  ADD PRIMARY KEY (`account_id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `phone_number` (`phone_number`);

--
-- Indexes for table `account_roles`
--
ALTER TABLE `account_roles`
  ADD PRIMARY KEY (`account_id`,`role_id`),
  ADD KEY `role_id` (`role_id`);

--
-- Indexes for table `bookings`
--
ALTER TABLE `bookings`
  ADD PRIMARY KEY (`booking_id`),
  ADD KEY `vehicle_id` (`vehicle_id`),
  ADD KEY `renter_id` (`renter_id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`role_id`),
  ADD UNIQUE KEY `role_name` (`role_name`);

--
-- Indexes for table `vehicles`
--
ALTER TABLE `vehicles`
  ADD PRIMARY KEY (`vehicle_id`),
  ADD KEY `lessor_id` (`lessor_id`);

--
-- Indexes for table `vehicle_amenities`
--
ALTER TABLE `vehicle_amenities`
  ADD PRIMARY KEY (`amenity_id`),
  ADD UNIQUE KEY `amenity_name` (`amenity_name`);

--
-- Indexes for table `vehicle_amenity_mapping`
--
ALTER TABLE `vehicle_amenity_mapping`
  ADD PRIMARY KEY (`vehicle_id`,`amenity_id`),
  ADD KEY `amenity_id` (`amenity_id`);

--
-- Indexes for table `vehicle_images`
--
ALTER TABLE `vehicle_images`
  ADD PRIMARY KEY (`image_id`),
  ADD KEY `vehicle_id` (`vehicle_id`),
  ADD KEY `is_primary` (`is_primary`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `accounts`
--
ALTER TABLE `accounts`
  MODIFY `account_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `bookings`
--
ALTER TABLE `bookings`
  MODIFY `booking_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `role_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `vehicles`
--
ALTER TABLE `vehicles`
  MODIFY `vehicle_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `vehicle_amenities`
--
ALTER TABLE `vehicle_amenities`
  MODIFY `amenity_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `vehicle_images`
--
ALTER TABLE `vehicle_images`
  MODIFY `image_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `account_roles`
--
ALTER TABLE `account_roles`
  ADD CONSTRAINT `fk_account_roles_account` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`account_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_account_roles_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`) ON DELETE CASCADE;

--
-- Constraints for table `bookings`
--
ALTER TABLE `bookings`
  ADD CONSTRAINT `fk_bookings_renter` FOREIGN KEY (`renter_id`) REFERENCES `accounts` (`account_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_bookings_vehicle` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles` (`vehicle_id`) ON DELETE CASCADE;

--
-- Constraints for table `vehicles`
--
ALTER TABLE `vehicles`
  ADD CONSTRAINT `fk_vehicles_lessor` FOREIGN KEY (`lessor_id`) REFERENCES `accounts` (`account_id`) ON DELETE CASCADE;

--
-- Constraints for table `vehicle_amenity_mapping`
--
ALTER TABLE `vehicle_amenity_mapping`
  ADD CONSTRAINT `fk_vehicle_amenity_amenity` FOREIGN KEY (`amenity_id`) REFERENCES `vehicle_amenities` (`amenity_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_vehicle_amenity_vehicle` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles` (`vehicle_id`) ON DELETE CASCADE;

--
-- Constraints for table `vehicle_images`
--
ALTER TABLE `vehicle_images`
  ADD CONSTRAINT `fk_vehicle_images_vehicle` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles` (`vehicle_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
