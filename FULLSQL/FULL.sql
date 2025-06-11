-- PostgreSQL Database Schema
-- Converted from MySQL to PostgreSQL

-- Create database (uncomment if needed)
-- CREATE DATABASE test;

-- --------------------------------------------------------

--
-- Table structure for table roles
--

CREATE TABLE roles (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL UNIQUE
);

--
-- Dumping data for table roles
--

INSERT INTO roles (role_name) VALUES 
('renter'),
('lessor'),
('admin');

-- --------------------------------------------------------

--
-- Table structure for table accounts
--

CREATE TABLE accounts (
    account_id SERIAL PRIMARY KEY,
    username TEXT NOT NULL,
    phone_number VARCHAR(255) NOT NULL UNIQUE,
    password TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

--
-- Dumping data for table accounts
--

INSERT INTO accounts (username, phone_number, password, created_at) VALUES
('abc', '0982742410', '$2b$12$ef/chg7hja1kXvxioJRUbuHqIuVuOBrSkYnCohO.ilH6ZA/eS5jA2', '2025-05-28 08:48:03'),
('cac', '0123456789', '$2y$10$rpqLOsIkKMDRsbkL5CvI5ehDUvsMQv4MF485lLveUgcqV/qVPpygG', '2025-05-28 19:08:53'),
('lessor1', '0987654321', '123qwe!@#', '2025-05-30 03:00:00'),
('admin', '0998877665', '$2b$12$7WKrnnN1JtUpVRguUC4pTOOMlwbi8TynqKzgQ0nD3iHvUMZ2Buofe', '2025-06-08 10:32:42');

-- --------------------------------------------------------

--
-- Table structure for table account_roles
--

CREATE TABLE account_roles (
    account_id INTEGER NOT NULL,
    role_id INTEGER NOT NULL,
    PRIMARY KEY (account_id, role_id),
    FOREIGN KEY (account_id) REFERENCES accounts(account_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(role_id) ON DELETE CASCADE ON UPDATE CASCADE
);

--
-- Dumping data for table account_roles
--

INSERT INTO account_roles (account_id, role_id) VALUES
(1, 1),
(3, 2),
(2, 3),
(4, 3);

-- --------------------------------------------------------

--
-- Table structure for table vehicles
--

CREATE TABLE vehicles (
    vehicle_id SERIAL PRIMARY KEY,
    lessor_id INTEGER NOT NULL,
    name VARCHAR(255) NOT NULL,
    rating DECIMAL(2,1) DEFAULT 0.0,
    total_trips INTEGER DEFAULT 0,
    location TEXT NOT NULL,
    transmission VARCHAR(50),
    seats INTEGER,
    fuel_type VARCHAR(50),
    base_price DECIMAL(10,2) NOT NULL,
    vehicle_type VARCHAR(50),
    description TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'rented', 'maintenance', 'inactive')),
    is_favorite BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (lessor_id) REFERENCES accounts(account_id) ON DELETE CASCADE ON UPDATE CASCADE
);

--
-- Dumping data for table vehicles
--

INSERT INTO vehicles (lessor_id, name, rating, total_trips, location, transmission, seats, fuel_type, base_price, vehicle_type, description, status, is_favorite, created_at, updated_at) VALUES
(3, 'Toyota Vios 2023', 4.8, 125, 'TP.HCM - 456 Lê Văn Sỹ, Phường 14, Quận 3', 'Manual', 4, 'gasoline', 900000.00, 'sedan', 'Fuel-efficient family car, suitable for city driving and short trips.', 'rented', FALSE, '2025-05-01 01:00:00', '2025-06-09 03:42:43'),
(3, 'Honda CR-V 2024', 4.9, 180, 'Hà Nội - 123 Trần Phú, Ba Đình', 'Automatic', 7, 'gasoline', 1500000.00, 'suv', 'Spacious SUV, suitable for family and long distance travel.', 'rented', FALSE, '2025-05-02 02:00:00', '2025-05-31 03:00:00'),
(3, 'Kia Morning 2022', 4.5, 200, 'Đà Nẵng - 567 Nguyễn Văn Linh, Hải Châu', 'Manual', 4, 'gasoline', 500000.00, 'hatchback', 'Compact, economical car, ideal for inner city travel.', 'available', FALSE, '2025-05-03 00:00:00', '2025-05-31 01:00:00'),
(3, 'Mazda CX-5 2023', 4.7, 150, 'Hà Nội - 456 Hoàn Kiếm, Ba Đình', 'Automatic', 5, 'electric', 1200000.00, 'crossover', 'Powerful, stylish, all-terrain crossover.', 'available', TRUE, '2025-05-03 23:00:00', '2025-06-07 10:21:10'),
(3, 'Ford Ranger 2024', 4.6, 90, 'Bắc Ninh - 789 Nguyễn Trãi, Suối Hoa', 'Manual', 5, 'diesel', 1800000.00, 'pickup', 'Powerful pickup truck, suitable for work and off-road travel.', 'available', FALSE, '2025-05-04 22:00:00', '2025-05-30 23:00:00'),
(3, 'Lamborghini Huracán 2023', 4.9, 23, 'TP.HCM - 123 Nguyễn Huệ, Quận 1', 'Automatic', 2, 'gasoline', 8500000.00, 'supercar', 'The powerful Lamborghini Huracán supercar with a classy design, suitable for speed experiences.', 'rented', TRUE, '2025-06-08 02:00:00', '2025-06-09 05:30:23'),
(3, 'Porsche 911 GT3 RS 2024', 4.8, 30, 'Hà Nội - 456 Hoàn Kiếm, Ba Đình', 'Manual', 2, 'gasoline', 8900000.00, 'supercar', 'Porsche 911 GT3 RS with outstanding performance, for those who love speed and racing.', 'available', FALSE, '2025-06-08 03:00:00', '2025-06-07 20:25:03'),
(3, 'Maserati MC20 2023', 4.7, 40, 'Đà Nẵng - 567 Nguyễn Văn Linh, Hải Châu', 'Automatic', 2, 'gasoline', 9000000.00, 'supercar', 'Maserati MC20 with luxurious design and high performance, ideal for a premium driving experience.', 'available', TRUE, '2025-06-08 04:00:00', '2025-06-08 09:00:37'),
(3, 'McLaren 720S 2024', 4.9, 12, 'Đà Nẵng - 567 Nguyễn Văn Linh, Hải Châu', '7-speed automatic', 2, 'gasoline', 9500000.00, 'supercar', 'McLaren 720S with advanced aerodynamics and 4.0L twin-turbo V8 engine. Outstanding performance with futuristic design.', 'available', TRUE, '2025-06-01 07:00:00', '2025-06-09 05:26:34'),
(3, 'Aston Martin DB11 V12 2024', 4.9, 22, 'Hà Nội - 456 Hoàn Kiếm, Ba Đình', '8-speed automatic', 4, 'gasoline', 8000000.00, 'supercar', 'Aston Martin DB11 V12 - Premium GT with elegant British style. Powerful and smooth 5.2L twin-turbo V12 engine.', 'rented', FALSE, '2025-06-01 08:00:00', '2025-06-09 04:40:37'),
(3, 'Bentley Continental GT 2024', 4.8, 28, 'TP.HCM - 456 Lê Văn Sỹ, Phường 14, Quận 3', '8-speed manual', 4, 'gasoline', 7123000.00, 'supercar', 'Bentley Continental GT - the perfect combination of high performance and absolute luxury. High-end handcrafted interior.', 'rented', FALSE, '2025-06-01 09:00:00', '2025-06-09 09:06:00'),
(3, 'Lamborghini Aventador SVJ 2024', 5.0, 8, 'Hà Nội - 456 Hoàn Kiếm, Ba Đình', '7-speed manual', 2, 'gasoline', 8347600.00, 'supercar', 'Lamborghini Aventador SVJ - the pinnacle of the Aventador line with active aerodynamics. 6.5L naturally aspirated V12 engine, emotional sound.', 'available', FALSE, '2025-06-01 10:00:00', '2025-06-09 04:21:46'),
(3, 'Ferrari 488 GTB 2024', 5.0, 18, 'TP.HCM - 456 Lê Văn Sỹ, Phường 14, Quận 3', '7-speed automatic', 2, 'gasoline', 10000000.00, 'supercar', 'Ferrari 488 GTB - a symbol of speed and passion. 3.9L twin-turbo V8 engine, unmistakable Ferrari sound.', 'rented', TRUE, '2025-06-01 06:00:00', '2025-06-09 10:12:25');

-- --------------------------------------------------------

--
-- Table structure for table bookings
--

CREATE TABLE bookings (
    booking_id SERIAL PRIMARY KEY,
    vehicle_id INTEGER NOT NULL,
    renter_id INTEGER NOT NULL,
    pickup_date DATE NOT NULL,
    pickup_time TIME NOT NULL,
    return_date DATE NOT NULL,
    return_time TIME NOT NULL,
    pickup_location TEXT NOT NULL,
    return_location TEXT NOT NULL,
    total_price DECIMAL(15,2) NOT NULL,
    discount_applied DECIMAL(15,2) DEFAULT 0.00,
    final_price DECIMAL(15,2) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'ongoing', 'completed', 'cancelled')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(vehicle_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (renter_id) REFERENCES accounts(account_id) ON DELETE CASCADE ON UPDATE CASCADE
);

--
-- Dumping data for table bookings
--

INSERT INTO bookings (vehicle_id, renter_id, pickup_date, pickup_time, return_date, return_time, pickup_location, return_location, total_price, discount_applied, final_price, status, created_at, updated_at) VALUES
(1, 1, '2025-06-15', '09:00:00', '2025-06-17', '18:00:00', 'TP.HCM - 456 Lê Văn Sỹ, Phường 14, Quận 3', 'TP.HCM - 456 Lê Văn Sỹ, Phường 14, Quận 3', 1800000.00, 270000.00, 1530000.00, 'confirmed', '2025-06-01 03:30:00', '2025-06-01 03:30:00'),
(2, 2, '2025-05-20', '08:00:00', '2025-05-25', '17:00:00', 'Hà Nội - 123 Trần Phú, Ba Đình, Hà Nội', 'Hà Nội - 123 Trần Phú, Ba Đình, Hà Nội', 7500000.00, 1500000.00, 6000000.00, 'completed', '2025-05-10 02:00:00', '2025-05-25 10:00:00'),
(3, 1, '2025-06-01', '10:00:00', '2025-06-02', '10:00:00', 'Đà Nẵng - 567 Nguyễn Văn Linh, Hải Châu, Đà Nẵng', 'Đà Nẵng - 567 Nguyễn Văn Linh, Hải Châu, Đà Nẵng', 500000.00, 50000.00, 450000.00, 'ongoing', '2025-05-25 01:00:00', '2025-05-31 03:00:00'),
(4, 2, '2025-07-01', '14:00:00', '2025-07-03', '14:00:00', 'Huế - 234 Lê Lợi, Phú Hậu, Huế', 'Huế - 234 Lê Lợi, Phú Hậu, Huế', 2400000.00, 360000.00, 2040000.00, 'pending', '2025-06-20 05:00:00', '2025-06-20 05:00:00'),
(5, 1, '2025-05-15', '07:00:00', '2025-05-17', '19:00:00', 'Bắc Ninh - 789 Nguyễn Trãi, Suối Hoa, Bắc Ninh', 'Bắc Ninh - 789 Nguyễn Trãi, Suối Hoa, Bắc Ninh', 3600000.00, 900000.00, 2700000.00, 'completed', '2025-05-01 08:00:00', '2025-05-17 12:00:00'),
(1, 2, '2025-06-20', '11:00:00', '2025-06-21', '11:00:00', 'TP.HCM - 456 Lê Văn Sỹ, Phường 14, Quận 3', 'TP.HCM - 456 Lê Văn Sỹ, Phường 14, Quận 3', 900000.00, 90000.00, 810000.00, 'confirmed', '2025-06-10 07:00:00', '2025-06-10 07:00:00'),
(2, 1, '2025-06-10', '09:00:00', '2025-06-12', '18:00:00', 'Hà Nội - 123 Trần Phú, Ba Đình, Hà Nội', 'Hà Nội - 123 Trần Phú, Ba Đình, Hà Nội', 3000000.00, 300000.00, 2700000.00, 'cancelled', '2025-06-01 04:00:00', '2025-06-05 02:00:00'),
(3, 2, '2025-07-05', '08:00:00', '2025-07-07', '17:00:00', 'Đà Nẵng - 567 Nguyễn Văn Linh, Hải Châu, Đà Nẵng', 'Đà Nẵng - 567 Nguyễn Văn Linh, Hải Châu, Đà Nẵng', 1000000.00, 100000.00, 900000.00, 'pending', '2025-06-25 03:00:00', '2025-06-25 03:00:00'),
(4, 1, '2025-06-25', '12:00:00', '2025-06-30', '12:00:00', 'Huế - 234 Lê Lợi, Phú Hậu, Huế', 'Huế - 234 Lê Lợi, Phú Hậu, Huế', 6000000.00, 1200000.00, 4800000.00, 'confirmed', '2025-06-15 06:00:00', '2025-06-15 06:00:00'),
(5, 2, '2025-06-01', '15:00:00', '2025-06-03', '15:00:00', 'Bắc Ninh - 789 Nguyễn Trãi, Suối Hoa, Bắc Ninh', 'Bắc Ninh - 789 Nguyễn Trãi, Suối Hoa, Bắc Ninh', 3600000.00, 900000.00, 2700000.00, 'ongoing', '2025-05-20 09:00:00', '2025-05-31 09:00:00');

-- --------------------------------------------------------

--
-- Table structure for table favorites
--

CREATE TABLE favorites (
    id SERIAL PRIMARY KEY,
    account_id INTEGER NOT NULL,
    vehicle_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(account_id, vehicle_id),
    FOREIGN KEY (account_id) REFERENCES accounts(account_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(vehicle_id) ON DELETE CASCADE ON UPDATE CASCADE
);

--
-- Dumping data for table favorites
--

INSERT INTO favorites (account_id, vehicle_id, created_at) VALUES
(2, 13, '2025-06-09 01:03:52');

-- --------------------------------------------------------

--
-- Table structure for table vehicle_amenities
--

CREATE TABLE vehicle_amenities (
    amenity_id SERIAL PRIMARY KEY,
    amenity_name VARCHAR(50) NOT NULL UNIQUE,
    amenity_icon VARCHAR(50),
    description TEXT
);

--
-- Dumping data for table vehicle_amenities
--

INSERT INTO vehicle_amenities (amenity_name, amenity_icon, description) VALUES
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
('radar', 'radar', 'Cảnh báo điểm mù'),
('ChildSeat', 'childseat', 'Ghế cho trẻ em');

-- --------------------------------------------------------

--
-- Table structure for table vehicle_amenity_mapping
--

CREATE TABLE vehicle_amenity_mapping (
    vehicle_id INTEGER NOT NULL,
    amenity_id INTEGER NOT NULL,
    PRIMARY KEY (vehicle_id, amenity_id),
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(vehicle_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (amenity_id) REFERENCES vehicle_amenities(amenity_id) ON DELETE CASCADE ON UPDATE CASCADE
);

--
-- Dumping data for table vehicle_amenity_mapping
--

INSERT INTO vehicle_amenity_mapping (vehicle_id, amenity_id) VALUES
(1, 1), (2, 1), (3, 1), (4, 1), (5, 1), (6, 1), (7, 1), (8, 1), (9, 1), (10, 1), (11, 1), (12, 1), (13, 1),
(1, 2), (2, 2), (3, 2), (4, 2), (9, 2), (10, 2), (11, 2), (12, 2), (13, 2),
(1, 3), (2, 3), (4, 3), (5, 3), (6, 3), (7, 3), (8, 3), (9, 3), (10, 3), (11, 3), (12, 3), (13, 3),
(6, 4), (8, 4),
(1, 5), (2, 5), (9, 5), (10, 5), (11, 5), (12, 5), (13, 5),
(6, 6), (7, 6), (8, 6), (9, 6), (10, 6), (11, 6), (12, 6),
(1, 7), (2, 7), (9, 7), (10, 7), (11, 7), (12, 7),
(2, 8), (4, 8), (6, 8), (7, 8), (8, 8), (9, 8), (10, 8), (11, 8), (12, 8),
(3, 9), (6, 9), (7, 9), (8, 9), (9, 9), (10, 9), (11, 9), (12, 9),
(4, 11), (6, 11), (7, 11), (8, 11), (9, 11), (10, 11), (11, 11), (12, 11),
(5, 12),
(5, 13), (6, 13), (7, 13), (8, 13), (9, 13), (10, 13), (11, 13), (12, 13),
(5, 14), (6, 14), (7, 14), (8, 14), (9, 14), (10, 14), (11, 14), (12, 14),
(1, 15), (5, 15);

-- --------------------------------------------------------

--
-- Table structure for table vehicle_images
--

CREATE TABLE vehicle_images (
    image_id SERIAL PRIMARY KEY,
    vehicle_id INTEGER NOT NULL,
    image_url TEXT NOT NULL,
    is_primary BOOLEAN NOT NULL DEFAULT FALSE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(vehicle_id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Create index on is_primary for better performance
CREATE INDEX idx_vehicle_images_is_primary ON vehicle_images(is_primary);

--
-- Dumping data for table vehicle_images
--

INSERT INTO vehicle_images (vehicle_id, image_url, is_primary, display_order, created_at) VALUES
(1, '/cars/ToyotaVios2023/1.png', TRUE, 1, '2025-05-01 01:00:00'),
(1, '/cars/FordRange2024/2.png', FALSE, 2, '2025-05-01 01:00:00'),
(1, '/cars/ToyotaVios2023/3.png', FALSE, 3, '2025-05-01 01:00:00'),
(2, 'https://example.com/car2_1.jpg', TRUE, 1, '2025-05-02 02:00:00'),
(2, 'https://example.com/car2_2.jpg', FALSE, 2, '2025-05-02 02:00:00'),
(3, '/cars/KiaMorning2022/1.png', TRUE, 1, '2025-05-03 00:00:00'),
(4, '/cars/MazdaCx52023/1.png', TRUE, 1, '2025-05-03 23:00:00'),
(4, '/cars/MazdaCx52023/2.png', FALSE, 2, '2025-05-03 23:00:00'),
(5, '/cars/FordRange2024/1.png', TRUE, 1, '2025-05-04 22:00:00'),
(5, '/cars/FordRange2024/2.png', FALSE, 2, '2025-06-03 08:44:36'),
(5, '/cars/FordRange2024/3.png', FALSE, 3, '2025-06-03 09:52:18'),
(3, '/cars/KiaMorning2022/2.png', FALSE, 2, '2025-06-03 10:00:20'),
(6, '/cars/LamborghiniHuracan2023/1.png', TRUE, 1, '2025-06-08 02:00:00'),
(6, '/cars/LamborghiniHuracan2023/2.png', FALSE, 2, '2025-06-08 02:00:00'),
(7, '/cars/Porsche911GT3RS2024/1.png', TRUE, 1, '2025-06-08 03:00:00'),
(7, '/cars/Porsche911GT3RS2024/2.png', FALSE, 2, '2025-06-08 03:00:00'),
(8, '/cars/MaseratiMC202023/1.png', TRUE, 1, '2025-06-08 04:00:00'),
(8, '/cars/MaseratiMC202023/2.png', FALSE, 2, '2025-06-08 04:00:00'),
(6, '/cars/LamborghiniHuracan2023/3.png', FALSE, 3, '2025-06-08 03:22:10'),
(7, '/cars/Porsche911GT3RS2024/3.png', FALSE, 3, '2025-06-08 03:23:07'),
(8, '/cars/MaseratiMC202023/3.png', FALSE, 3, '2025-06-08 03:23:47'),
(9, '/cars/McLaren720S2024/1.png', TRUE, 1, '2025-06-08 03:00:00'),
(9, '/cars/McLaren720S2024/2.png', FALSE, 2, '2025-06-08 03:00:00'),
(9, '/cars/McLaren720S2024/3.png', FALSE, 3, '2025-06-08 03:00:00'),
(10, '/cars/AstonMartinDB11V122024/1.png', TRUE, 1, '2025-06-08 03:00:00'),
(10, '/cars/AstonMartinDB11V122024/2.png', FALSE, 2, '2025-06-08 03:00:00'),
(10, '/cars/AstonMartinDB11V122024/3.png', FALSE, 3, '2025-06-08 03:00:00'),
(11, '/cars/BentleyContinentalGT2024/1.png', TRUE, 1, '2025-06-08 03:00:00'),
(11, '/cars/BentleyContinentalGT2024/2.png', FALSE, 2, '2025-06-08 03:00:00'),
(11, '/cars/BentleyContinentalGT2024/3.png', FALSE, 3, '2025-06-08 03:00:00'),
(12, '/cars/LamborghiniAventadorSVJ2024/1.png', TRUE, 1, '2025-06-08 03:00:00'),
(12, '/cars/LamborghiniAventadorSVJ2024/2.png', FALSE, 2, '2025-06-08 03:00:00'),
(12, '/cars/LamborghiniAventadorSVJ2024/3.png', FALSE, 3, '2025-06-08 03:00:00'),
(13, '/cars/Ferrari488GTB2024/1.png', TRUE, 1, '2025-06-08 03:00:00'),
(13, '/cars/Ferrari488GTB2024/2.png', FALSE, 2, '2025-06-08 03:00:00'),
(13, '/cars/Ferrari488GTB2024/3.png', FALSE, 3, '2025-06-08 03:00:00');

-- --------------------------------------------------------

--
-- Functions and Triggers
--

-- Function to automatically assign default role to new accounts
CREATE OR REPLACE FUNCTION assign_default_role()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO account_roles (account_id, role_id)
    VALUES (NEW.account_id, 1); -- Assign default 'renter' role (role_id = 1)
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to execute after account insert
CREATE TRIGGER after_account_insert
    AFTER INSERT ON accounts
    FOR EACH ROW
    EXECUTE FUNCTION assign_default_role();

-- Function to update vehicles updated_at timestamp
CREATE OR REPLACE FUNCTION update_vehicles_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update vehicles timestamp
CREATE TRIGGER update_vehicles_updated_at
    BEFORE UPDATE ON vehicles
    FOR EACH ROW
    EXECUTE FUNCTION update_vehicles_timestamp();

-- Function to update bookings updated_at timestamp
CREATE OR REPLACE FUNCTION update_bookings_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END
$$ LANGUAGE plpgsql;