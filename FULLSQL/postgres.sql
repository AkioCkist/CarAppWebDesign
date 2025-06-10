DROP TABLE IF EXISTS "public"."account_roles";
-- Table Definition
CREATE TABLE "public"."account_roles" (
    "account_id" int4 NOT NULL,
    "role_id" int4 NOT NULL,
    CONSTRAINT "account_roles_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("account_id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "account_roles_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("role_id") ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY ("account_id","role_id")
);

DROP TABLE IF EXISTS "public"."accounts";
-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS accounts_account_id_seq;

-- Table Definition
CREATE TABLE "public"."accounts" (
    "account_id" int4 NOT NULL DEFAULT nextval('accounts_account_id_seq'::regclass),
    "username" text NOT NULL,
    "phone_number" text NOT NULL,
    "password" text NOT NULL,
    "created_at" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("account_id")
);


-- Indices
CREATE UNIQUE INDEX accounts_phone_number_key ON public.accounts USING btree (phone_number);

DROP TABLE IF EXISTS "public"."bookings";
-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS bookings_booking_id_seq;
DROP TYPE IF EXISTS "public"."BookingStatus";
CREATE TYPE "public"."BookingStatus" AS ENUM ('pending', 'confirmed', 'ongoing', 'completed', 'cancelled');

-- Table Definition
CREATE TABLE "public"."bookings" (
    "booking_id" int4 NOT NULL DEFAULT nextval('bookings_booking_id_seq'::regclass),
    "vehicle_id" int4 NOT NULL,
    "renter_id" int4 NOT NULL,
    "pickup_date" date NOT NULL,
    "pickup_time" time NOT NULL,
    "return_date" date NOT NULL,
    "return_time" time NOT NULL,
    "pickup_location" text NOT NULL,
    "return_location" text NOT NULL,
    "total_price" numeric(15,2) NOT NULL,
    "discount_applied" numeric(15,2) DEFAULT 0.00,
    "final_price" numeric(15,2) NOT NULL,
    "status" "public"."BookingStatus" NOT NULL DEFAULT 'pending'::"BookingStatus",
    "created_at" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "bookings_renter_id_fkey" FOREIGN KEY ("renter_id") REFERENCES "public"."accounts"("account_id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "bookings_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "public"."vehicles"("vehicle_id") ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY ("booking_id")
);

DROP TABLE IF EXISTS "public"."favorites";
-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS favorites_id_seq;

-- Table Definition
CREATE TABLE "public"."favorites" (
    "id" int4 NOT NULL DEFAULT nextval('favorites_id_seq'::regclass),
    "account_id" int4 NOT NULL,
    "vehicle_id" int4 NOT NULL,
    "created_at" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "favorites_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("account_id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "favorites_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "public"."vehicles"("vehicle_id") ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY ("id")
);


-- Indices
CREATE UNIQUE INDEX favorites_account_id_vehicle_id_key ON public.favorites USING btree (account_id, vehicle_id);

DROP TABLE IF EXISTS "public"."roles";
-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS roles_role_id_seq;

-- Table Definition
CREATE TABLE "public"."roles" (
    "role_id" int4 NOT NULL DEFAULT nextval('roles_role_id_seq'::regclass),
    "role_name" varchar(50) NOT NULL,
    PRIMARY KEY ("role_id")
);


-- Indices
CREATE UNIQUE INDEX roles_role_name_key ON public.roles USING btree (role_name);

DROP TABLE IF EXISTS "public"."vehicle_amenities";
-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS vehicle_amenities_amenity_id_seq;

-- Table Definition
CREATE TABLE "public"."vehicle_amenities" (
    "amenity_id" int4 NOT NULL DEFAULT nextval('vehicle_amenities_amenity_id_seq'::regclass),
    "amenity_name" varchar(50) NOT NULL,
    "amenity_icon" varchar(50),
    "description" text,
    PRIMARY KEY ("amenity_id")
);


-- Indices
CREATE UNIQUE INDEX vehicle_amenities_amenity_name_key ON public.vehicle_amenities USING btree (amenity_name);

DROP TABLE IF EXISTS "public"."vehicle_amenity_mapping";
-- Table Definition
CREATE TABLE "public"."vehicle_amenity_mapping" (
    "vehicle_id" int4 NOT NULL,
    "amenity_id" int4 NOT NULL,
    CONSTRAINT "vehicle_amenity_mapping_amenity_id_fkey" FOREIGN KEY ("amenity_id") REFERENCES "public"."vehicle_amenities"("amenity_id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "vehicle_amenity_mapping_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "public"."vehicles"("vehicle_id") ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY ("vehicle_id","amenity_id")
);

DROP TABLE IF EXISTS "public"."vehicle_images";
-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS vehicle_images_image_id_seq;

-- Table Definition
CREATE TABLE "public"."vehicle_images" (
    "image_id" int4 NOT NULL DEFAULT nextval('vehicle_images_image_id_seq'::regclass),
    "vehicle_id" int4 NOT NULL,
    "image_url" text NOT NULL,
    "is_primary" bool NOT NULL DEFAULT false,
    "display_order" int4 DEFAULT 0,
    "created_at" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "vehicle_images_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "public"."vehicles"("vehicle_id") ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY ("image_id")
);


-- Indices
CREATE INDEX vehicle_images_is_primary_idx ON public.vehicle_images USING btree (is_primary);

DROP TABLE IF EXISTS "public"."vehicles";
-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS vehicles_vehicle_id_seq;
DROP TYPE IF EXISTS "public"."VehicleStatus";
CREATE TYPE "public"."VehicleStatus" AS ENUM ('available', 'rented', 'maintenance', 'inactive');

-- Table Definition
CREATE TABLE "public"."vehicles" (
    "vehicle_id" int4 NOT NULL DEFAULT nextval('vehicles_vehicle_id_seq'::regclass),
    "lessor_id" int4 NOT NULL,
    "name" varchar(255) NOT NULL,
    "rating" numeric(2,1) DEFAULT 0.0,
    "total_trips" int4 DEFAULT 0,
    "location" text NOT NULL,
    "transmission" varchar(50),
    "seats" int4,
    "fuel_type" varchar(50),
    "base_price" numeric(10,2) NOT NULL,
    "vehicle_type" varchar(50),
    "description" text,
    "status" "public"."VehicleStatus" NOT NULL DEFAULT 'available'::"VehicleStatus",
    "is_favorite" bool NOT NULL DEFAULT false,
    "created_at" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "vehicles_lessor_id_fkey" FOREIGN KEY ("lessor_id") REFERENCES "public"."accounts"("account_id") ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY ("vehicle_id")
);

INSERT INTO "public"."account_roles" ("account_id", "role_id") VALUES
(1, 1),
(3, 2),
(4, 3),
(15, 1),
(16, 1),
(17, 1),
(18, 1),
(19, 1),
(2, 2),
(20, 1);
INSERT INTO "public"."accounts" ("account_id", "username", "phone_number", "password", "created_at") VALUES
(2, 'cac', '0123456789', '$2y$10$rpqLOsIkKMDRsbkL5CvI5ehDUvsMQv4MF485lLveUgcqV/qVPpygG', '2025-05-29 02:08:53'),
(3, 'lessor1', '0987654321', '123qwe!@#', '2025-05-30 10:00:00'),
(4, 'admin', '0998877665', '$2b$12$7WKrnnN1JtUpVRguUC4pTOOMlwbi8TynqKzgQ0nD3iHvUMZ2Buofe', '2025-06-08 17:32:42.915'),
(15, 'Amirah', '0987654322', '$2b$12$mLnnJaRFFdsbWUR6G6GI8OKUYIbtu1dvq2Yh7sK97TK9I7gmYqsLq', '2025-06-09 04:07:31.853'),
(16, 'Yuuko', '0987654333', '$2b$12$F.qY0mEwqo2WL4mejuzUl.nryt4EwTZYflkqXsgmXSVktru3y5KmG', '2025-06-09 04:09:57.609'),
(17, 'vnuk', '01122334455', '$2b$12$R8zjhueGSWTdSA4tvzJBoOL.3OCO24w.ezzy82w2FuKLBRQNEAzPC', '2025-06-09 04:59:26.04'),
(18, 'Anonymous', '0999888777', '$2b$12$n2ZVbc6DwP5.C7hLtqN7mO0Y6pm4mtyXX3aopvTsC1MS6sBU9Rrya', '2025-06-09 11:34:36.13'),
(19, 'Hồ Anh Tuấn', '111222333444555', '$2b$12$4sAr6iT/yGPsxeGCgpIVQOhHfh5akoQ4sNb22XIsljSEPdg.wgFGy', '2025-06-09 14:01:30.165'),
(1, 'abcxyz', '0982742410', '$2b$12$jhvdJw43tXnbmZtVqfiO6.AUjcJFYJWV9ny99e9mB31h/AsOIfnry', '2025-05-28 15:48:03'),
(20, 'Quyen', '0993445673', '$2b$12$FdGp/eF97AHKHvSfaPua2e4fVClPaqv8tUZhr/EmjviAQ20iKN41W', '2025-06-10 14:21:37.417');
INSERT INTO "public"."bookings" ("booking_id", "vehicle_id", "renter_id", "pickup_date", "pickup_time", "return_date", "return_time", "pickup_location", "return_location", "total_price", "discount_applied", "final_price", "status", "created_at", "updated_at") VALUES
(1, 1, 1, '2025-06-15', '09:00:00', '2025-06-17', '18:00:00', 'TP.HCM - 456 Lê Văn Sỹ, Phường 14, Quận 3', 'TP.HCM - 456 Lê Văn Sỹ, Phường 14, Quận 3', 1800000.00, 270000.00, 1530000.00, 'confirmed', '2025-06-01 10:30:00', '2025-06-01 10:30:00'),
(2, 2, 2, '2025-05-20', '08:00:00', '2025-05-25', '17:00:00', 'Hà Nội - 123 Trần Phú, Ba Đình, Hà Nội', 'Hà Nội - 123 Trần Phú, Ba Đình, Hà Nội', 7500000.00, 1500000.00, 6000000.00, 'completed', '2025-05-10 09:00:00', '2025-05-25 17:00:00'),
(3, 3, 1, '2025-06-01', '10:00:00', '2025-06-02', '10:00:00', 'Đà Nẵng - 567 Nguyễn Văn Linh, Hải Châu, Đà Nẵng', 'Đà Nẵng - 567 Nguyễn Văn Linh, Hải Châu, Đà Nẵng', 500000.00, 50000.00, 450000.00, 'ongoing', '2025-05-25 08:00:00', '2025-05-31 10:00:00'),
(4, 4, 2, '2025-07-01', '14:00:00', '2025-07-03', '14:00:00', 'Huế - 234 Lê Lợi, Phú Hậu, Huế', 'Huế - 234 Lê Lợi, Phú Hậu, Huế', 2400000.00, 360000.00, 2040000.00, 'pending', '2025-06-20 12:00:00', '2025-06-20 12:00:00'),
(5, 5, 1, '2025-05-15', '07:00:00', '2025-05-17', '19:00:00', 'Bắc Ninh - 789 Nguyễn Trãi, Suối Hoa, Bắc Ninh', 'Bắc Ninh - 789 Nguyễn Trãi, Suối Hoa, Bắc Ninh', 3600000.00, 900000.00, 2700000.00, 'completed', '2025-05-01 15:00:00', '2025-05-17 19:00:00'),
(6, 1, 2, '2025-06-20', '11:00:00', '2025-06-21', '11:00:00', 'TP.HCM - 456 Lê Văn Sỹ, Phường 14, Quận 3', 'TP.HCM - 456 Lê Văn Sỹ, Phường 14, Quận 3', 900000.00, 90000.00, 810000.00, 'confirmed', '2025-06-10 14:00:00', '2025-06-10 14:00:00'),
(7, 2, 1, '2025-06-10', '09:00:00', '2025-06-12', '18:00:00', 'Hà Nội - 123 Trần Phú, Ba Đình, Hà Nội', 'Hà Nội - 123 Trần Phú, Ba Đình, Hà Nội', 3000000.00, 300000.00, 2700000.00, 'cancelled', '2025-06-01 11:00:00', '2025-06-05 09:00:00'),
(8, 3, 2, '2025-07-05', '08:00:00', '2025-07-07', '17:00:00', 'Đà Nẵng - 567 Nguyễn Văn Linh, Hải Châu, Đà Nẵng', 'Đà Nẵng - 567 Nguyễn Văn Linh, Hải Châu, Đà Nẵng', 1000000.00, 100000.00, 900000.00, 'pending', '2025-06-25 10:00:00', '2025-06-25 10:00:00'),
(9, 4, 1, '2025-06-25', '12:00:00', '2025-06-30', '12:00:00', 'Huế - 234 Lê Lợi, Phú Hậu, Huế', 'Huế - 234 Lê Lợi, Phú Hậu, Huế', 6000000.00, 1200000.00, 4800000.00, 'confirmed', '2025-06-15 13:00:00', '2025-06-15 13:00:00'),
(10, 11, 1, '2025-06-10', '14:51:00', '2025-06-25', '15:51:00', 'TP.HCM', 'TP.HCM', 113968000.00, 0.00, 125364800.00, 'confirmed', '2025-06-10 13:53:44.919', '2025-06-10 13:53:44.919'),
(11, 12, 1, '2025-06-11', '03:10:00', '2025-06-12', '03:00:00', 'Pick-up Location', 'Drop-off Location', 8347600.00, 0.00, 9182360.00, 'confirmed', '2025-06-10 14:19:51.541', '2025-06-10 14:19:51.541'),
(12, 6, 1, '1999-12-14', '06:37:00', '2025-12-14', '03:11:00', 'Hà Nội', 'Đà Nẵng', 80724500000.00, 0.00, 88796950000.00, 'confirmed', '2025-06-10 14:34:11.237', '2025-06-10 14:34:11.237'),
(13, 8, 1, '2025-06-09', '20:02:00', '2025-06-25', '20:02:00', 'Đà Nẵng', 'Đà Nẵng', 144000000.00, 0.00, 158400000.00, 'confirmed', '2025-06-10 14:38:00.893', '2025-06-10 14:38:00.893');
INSERT INTO "public"."favorites" ("id", "account_id", "vehicle_id", "created_at") VALUES
(44, 2, 13, '2025-06-09 08:03:52.889'),
(45, 2, 7, '2025-06-10 06:57:09.347'),
(50, 1, 9, '2025-06-10 09:15:05.911'),
(51, 1, 7, '2025-06-10 09:15:06.786'),
(52, 1, 1, '2025-06-10 09:15:08.427'),
(53, 1, 11, '2025-06-10 09:15:09.583'),
(54, 1, 5, '2025-06-10 09:15:10.959');
INSERT INTO "public"."roles" ("role_id", "role_name") VALUES
(1, 'renter'),
(2, 'lessor'),
(3, 'administrator');
INSERT INTO "public"."vehicle_amenities" ("amenity_id", "amenity_name", "amenity_icon", "description") VALUES
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
(14, 'radar', 'radar', 'Cảnh báo điểm mù'),
(15, 'ChildSeat', 'childseat', 'Ghế cho trẻ em');
INSERT INTO "public"."vehicle_amenity_mapping" ("vehicle_id", "amenity_id") VALUES
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
(5, 14),
(5, 15),
(1, 15),
(6, 1),
(6, 3),
(6, 6),
(6, 8),
(6, 9),
(6, 11),
(6, 13),
(6, 14),
(7, 1),
(7, 3),
(7, 6),
(7, 8),
(7, 9),
(7, 11),
(7, 13),
(7, 14),
(8, 1),
(8, 3),
(8, 6),
(8, 8),
(8, 9),
(8, 11),
(8, 13),
(8, 14),
(6, 4),
(8, 4),
(9, 1),
(9, 2),
(9, 3),
(9, 5),
(9, 6),
(9, 7),
(9, 8),
(9, 9),
(9, 11),
(9, 13),
(9, 14),
(10, 1),
(10, 2),
(10, 3),
(10, 5),
(10, 6),
(10, 7),
(10, 8),
(10, 9),
(10, 11),
(10, 13),
(10, 14),
(11, 1),
(11, 2),
(11, 3),
(11, 5),
(11, 6),
(11, 7),
(11, 8),
(11, 9),
(11, 11),
(11, 13),
(11, 14),
(12, 1),
(12, 2),
(12, 3),
(12, 5),
(12, 6),
(12, 7),
(12, 8),
(12, 9),
(12, 11),
(12, 13),
(12, 14),
(13, 1),
(13, 2),
(13, 3),
(13, 5),
(13, 6),
(13, 7),
(13, 8),
(13, 9),
(13, 11),
(13, 13),
(13, 14);
INSERT INTO "public"."vehicle_images" ("image_id", "vehicle_id", "image_url", "is_primary", "display_order", "created_at") VALUES
(1, 1, '/cars/ToyotaVios2023/1.png', 't', 1, '2025-05-01 08:00:00'),
(3, 1, '/cars/ToyotaVios2023/3.png', 'f', 3, '2025-05-01 08:00:00'),
(6, 3, '/cars/KiaMorning2022/1.png', 't', 1, '2025-05-03 07:00:00'),
(7, 4, '/cars/MazdaCx52023/1.png', 't', 1, '2025-05-04 06:00:00'),
(8, 4, '/cars/MazdaCx52023/2.png', 'f', 2, '2025-05-04 06:00:00'),
(9, 5, '/cars/FordRange2024/1.png', 't', 1, '2025-05-05 05:00:00'),
(10, 5, '/cars/FordRange2024/2.png', 'f', 2, '2025-06-03 15:44:36'),
(24, 9, '/cars/McLaren720S2024/2.png', 'f', 2, '2025-06-08 10:00:00'),
(12, 5, '/cars/FordRange2024/3.png', 'f', 3, '2025-06-03 16:52:18'),
(13, 3, '/cars/KiaMorning2022/2.png', 'f', 2, '2025-06-03 17:00:20'),
(14, 6, '/cars/LamborghiniHuracan2023/1.png', 't', 1, '2025-06-08 09:00:00'),
(15, 6, '/cars/LamborghiniHuracan2023/2.png', 'f', 2, '2025-06-08 09:00:00'),
(16, 7, '/cars/Porsche911GT3RS2024/1.png', 't', 1, '2025-06-08 10:00:00'),
(17, 7, '/cars/Porsche911GT3RS2024/2.png', 'f', 2, '2025-06-08 10:00:00'),
(18, 8, '/cars/MaseratiMC202023/1.png', 't', 1, '2025-06-08 11:00:00'),
(19, 8, '/cars/MaseratiMC202023/2.png', 'f', 2, '2025-06-08 11:00:00'),
(20, 6, '/cars/LamborghiniHuracan2023/3.png', 'f', 3, '2025-06-08 10:22:10'),
(21, 7, '/cars/Porsche911GT3RS2024/3.png', 'f', 3, '2025-06-08 10:23:07'),
(22, 8, '/cars/MaseratiMC202023/3.png', 'f', 3, '2025-06-08 10:23:47'),
(25, 9, '/cars/McLaren720S2024/3.png', 'f', 3, '2025-06-08 10:00:00'),
(23, 9, '/cars/McLaren720S2024/1.png', 't', 1, '2025-06-08 10:00:00'),
(27, 10, '/cars/AstonMartinDB11V122024/2.png', 'f', 2, '2025-06-08 10:00:00'),
(28, 10, '/cars/AstonMartinDB11V122024/3.png', 'f', 3, '2025-06-08 10:00:00'),
(26, 10, '/cars/AstonMartinDB11V122024/1.png', 't', 1, '2025-06-08 10:00:00'),
(30, 11, '/cars/BentleyContinentalGT2024/2.png', 'f', 2, '2025-06-08 10:00:00'),
(31, 11, '/cars/BentleyContinentalGT2024/3.png', 'f', 3, '2025-06-08 10:00:00'),
(29, 11, '/cars/BentleyContinentalGT2024/1.png', 't', 1, '2025-06-08 10:00:00'),
(33, 12, '/cars/LamborghiniAventadorSVJ2024/2.png', 'f', 2, '2025-06-08 10:00:00'),
(34, 12, '/cars/LamborghiniAventadorSVJ2024/3.png', 'f', 3, '2025-06-08 10:00:00'),
(32, 12, '/cars/LamborghiniAventadorSVJ2024/1.png', 't', 1, '2025-06-08 10:00:00'),
(2, 1, '/cars/ToyotaVios2023/2.png', 'f', 2, '2025-05-01 08:00:00'),
(5, 2, '/cars/HondaCR-V2024/2.png', 'f', 2, '2025-05-02 09:00:00'),
(4, 2, '/cars/HondaCR-V2024/1.png', 't', 1, '2025-05-02 09:00:00'),
(35, 13, '/cars/Ferrari488GTB2024/1.png', 't', 1, '2025-06-08 10:00:00'),
(36, 13, '/cars/Ferrari488GTB2024/2.png', 'f', 2, '2025-06-08 10:00:00'),
(37, 13, '/cars/Ferrari488GTB2024/3.png', 'f', 3, '2025-06-08 10:00:00');
INSERT INTO "public"."vehicles" ("vehicle_id", "lessor_id", "name", "rating", "total_trips", "location", "transmission", "seats", "fuel_type", "base_price", "vehicle_type", "description", "status", "is_favorite", "created_at", "updated_at") VALUES
(9, 3, 'McLaren 720S 2024', 4.9, 12, 'Đà Nẵng - 567 Nguyễn Văn Linh, Hải Châu', '7-speed automatic', 2, 'gasoline', 9500000.00, 'supercar', 'McLaren 720S with advanced aerodynamics and 4.0L twin-turbo V8 engine. Outstanding performance with futuristic design.', 'available', 't', '2025-06-01 14:00:00', '2025-06-10 11:05:25.483'),
(11, 3, 'Bentley Continental GT 2024', 4.8, 28, 'TP.HCM - 456 Lê Văn Sỹ, Phường 14, Quận 3', '8-speed manual', 4, 'gasoline', 7123000.00, 'supercar', 'Bentley Continental GT - the perfect combination of high performance and absolute luxury. High-end handcrafted interior.', 'rented', 'f', '2025-06-01 16:00:00', '2025-06-10 13:53:45.026'),
(12, 3, 'Lamborghini Aventador SVJ 2024', 5.0, 8, 'Hà Nội - 456 Hoàn Kiếm, Ba Đình', '7-speed manual', 2, 'gasoline', 8347600.00, 'supercar', 'Lamborghini Aventador SVJ - the pinnacle of the Aventador line with active aerodynamics. 6.5L naturally aspirated V12 engine, emotional sound.', 'rented', 'f', '2025-06-01 17:00:00', '2025-06-10 14:19:51.991'),
(6, 3, 'Lamborghini Huracán 2023', 4.9, 23, 'TP.HCM - 123 Nguyễn Huệ, Quận 1', 'Automatic', 2, 'gasoline', 8500000.00, 'supercar', 'The powerful Lamborghini Huracán supercar with a classy design, suitable for speed experiences.', 'rented', 't', '2025-06-08 09:00:00', '2025-06-10 14:34:11.687'),
(8, 3, 'Maserati MC20 2023', 4.7, 40, 'Đà Nẵng - 567 Nguyễn Văn Linh, Hải Châu', 'Automatic', 2, 'gasoline', 9000000.00, 'supercar', 'Maserati MC20 with luxurious design and high performance, ideal for a premium driving experience.', 'rented', 't', '2025-06-08 11:00:00', '2025-06-10 14:38:01.359'),
(3, 3, 'Kia Morning 2022', 4.5, 200, 'Đà Nẵng - 567 Nguyễn Văn Linh, Hải Châu', 'Manual', 4, 'gasoline', 500000.00, 'hatchback', 'Compact, economical car, ideal for inner city travel.', 'available', 'f', '2025-05-03 07:00:00', '2025-05-31 08:00:00'),
(2, 3, 'Honda CR-V 2024', 4.9, 180, 'Hà Nội - 123 Trần Phú, Ba Đình', 'Automatic', 7, 'gasoline', 1500000.00, 'suv', 'Spacious SUV, suitable for family and long distance travel.', 'available', 'f', '2025-05-02 09:00:00', '2025-05-31 10:00:00'),
(4, 3, 'Mazda CX-5 2023', 4.7, 150, 'Hà Nội - 456 Hoàn Kiếm, Ba Đình', 'Automatic', 5, 'electric', 1200000.00, 'crossover', 'Powerful, stylish, all-terrain crossover.', 'available', 'f', '2025-05-04 06:00:00', '2025-06-07 17:21:10.38'),
(5, 3, 'Ford Ranger 2024', 4.6, 90, 'Bắc Ninh - 789 Nguyễn Trãi, Suối Hoa', 'Manual', 5, 'diesel', 1800000.00, 'pickup', 'Powerful pickup truck, suitable for work and off-road travel.', 'available', 'f', '2025-05-05 05:00:00', '2025-05-31 06:00:00'),
(1, 3, 'Toyota Vios 2023', 4.8, 125, 'TP.HCM - 456 Lê Văn Sỹ, Phường 14, Quận 3', 'Manual', 4, 'gasoline', 900000.00, 'sedan', 'Fuel-efficient family car, suitable for city driving and short trips.', 'available', 'f', '2025-05-01 08:00:00', '2025-06-09 10:42:43.681'),
(7, 3, 'Porsche 911 GT3 RS 2024', 4.8, 30, 'Hà Nội - 456 Hoàn Kiếm, Ba Đình', 'Manual', 2, 'gasoline', 8900000.00, 'supercar', 'Porsche 911 GT3 RS with outstanding performance, for those who love speed and racing.', 'available', 'f', '2025-06-08 10:00:00', '2025-06-10 10:33:58.985'),
(10, 3, 'Aston Martin DB11 V12 2024', 4.9, 22, 'Hà Nội - 456 Hoàn Kiếm, Ba Đình', '8-speed automatic', 4, 'gasoline', 8000000.00, 'supercar', 'Aston Martin DB11 V12 - Premium GT with elegant British style. Powerful and smooth 5.2L twin-turbo V12 engine.', 'available', 'f', '2025-06-01 15:00:00', '2025-06-10 07:45:52.574'),
(13, 3, 'Ferrari 488 GTB 2024', 5.0, 18, 'TP.HCM - 456 Lê Văn Sỹ, Phường 14, Quận 3', '7-speed automatic', 2, 'gasoline', 10000000.00, 'supercar', 'Ferrari 488 GTB - a symbol of speed and passion. 3.9L twin-turbo V8 engine, unmistakable Ferrari sound.', 'available', 't', '2025-06-01 13:00:00', '2025-06-10 13:44:56.465');
