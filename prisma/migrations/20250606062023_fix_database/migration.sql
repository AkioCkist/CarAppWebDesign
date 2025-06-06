/*
  Warnings:

  - You are about to drop the `Account` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AccountRole` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Booking` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Role` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Vehicle` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VehicleAmenity` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VehicleAmenityMapping` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VehicleImage` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AccountRole" DROP CONSTRAINT "AccountRole_account_id_fkey";

-- DropForeignKey
ALTER TABLE "AccountRole" DROP CONSTRAINT "AccountRole_role_id_fkey";

-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_renter_id_fkey";

-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_vehicle_id_fkey";

-- DropForeignKey
ALTER TABLE "Vehicle" DROP CONSTRAINT "Vehicle_lessor_id_fkey";

-- DropForeignKey
ALTER TABLE "VehicleAmenityMapping" DROP CONSTRAINT "VehicleAmenityMapping_amenity_id_fkey";

-- DropForeignKey
ALTER TABLE "VehicleAmenityMapping" DROP CONSTRAINT "VehicleAmenityMapping_vehicle_id_fkey";

-- DropForeignKey
ALTER TABLE "VehicleImage" DROP CONSTRAINT "VehicleImage_vehicle_id_fkey";

-- DropTable
DROP TABLE "Account";

-- DropTable
DROP TABLE "AccountRole";

-- DropTable
DROP TABLE "Booking";

-- DropTable
DROP TABLE "Role";

-- DropTable
DROP TABLE "Vehicle";

-- DropTable
DROP TABLE "VehicleAmenity";

-- DropTable
DROP TABLE "VehicleAmenityMapping";

-- DropTable
DROP TABLE "VehicleImage";

-- CreateTable
CREATE TABLE "accounts" (
    "account_id" SERIAL NOT NULL,
    "username" VARCHAR(50) NOT NULL,
    "phone_number" VARCHAR(20),
    "password" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("account_id")
);

-- CreateTable
CREATE TABLE "roles" (
    "role_id" SERIAL NOT NULL,
    "role_name" VARCHAR(50) NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("role_id")
);

-- CreateTable
CREATE TABLE "account_roles" (
    "account_id" INTEGER NOT NULL,
    "role_id" INTEGER NOT NULL,

    CONSTRAINT "account_roles_pkey" PRIMARY KEY ("account_id","role_id")
);

-- CreateTable
CREATE TABLE "vehicles" (
    "vehicle_id" SERIAL NOT NULL,
    "lessor_id" INTEGER NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "rating" DECIMAL(2,1) DEFAULT 0.0,
    "total_trips" INTEGER DEFAULT 0,
    "location" TEXT NOT NULL,
    "transmission" VARCHAR(50),
    "seats" INTEGER,
    "fuel_type" VARCHAR(50),
    "base_price" DECIMAL(10,2) NOT NULL,
    "vehicle_type" VARCHAR(50),
    "description" TEXT,
    "status" "VehicleStatus" NOT NULL DEFAULT 'available',
    "is_favorite" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vehicles_pkey" PRIMARY KEY ("vehicle_id")
);

-- CreateTable
CREATE TABLE "bookings" (
    "booking_id" SERIAL NOT NULL,
    "vehicle_id" INTEGER NOT NULL,
    "renter_id" INTEGER NOT NULL,
    "pickup_date" DATE NOT NULL,
    "pickup_time" TIME NOT NULL,
    "return_date" DATE NOT NULL,
    "return_time" TIME NOT NULL,
    "pickup_location" TEXT NOT NULL,
    "return_location" TEXT NOT NULL,
    "total_price" DECIMAL(10,2) NOT NULL,
    "discount_applied" DECIMAL(10,2) DEFAULT 0.00,
    "final_price" DECIMAL(10,2) NOT NULL,
    "status" "BookingStatus" NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bookings_pkey" PRIMARY KEY ("booking_id")
);

-- CreateTable
CREATE TABLE "vehicle_amenities" (
    "amenity_id" SERIAL NOT NULL,
    "amenity_name" VARCHAR(50) NOT NULL,
    "amenity_icon" VARCHAR(50),
    "description" TEXT,

    CONSTRAINT "vehicle_amenities_pkey" PRIMARY KEY ("amenity_id")
);

-- CreateTable
CREATE TABLE "vehicle_amenity_mapping" (
    "vehicle_id" INTEGER NOT NULL,
    "amenity_id" INTEGER NOT NULL,

    CONSTRAINT "vehicle_amenity_mapping_pkey" PRIMARY KEY ("vehicle_id","amenity_id")
);

-- CreateTable
CREATE TABLE "vehicle_images" (
    "image_id" SERIAL NOT NULL,
    "vehicle_id" INTEGER NOT NULL,
    "image_url" TEXT NOT NULL,
    "is_primary" BOOLEAN NOT NULL DEFAULT false,
    "display_order" INTEGER DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vehicle_images_pkey" PRIMARY KEY ("image_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "accounts_username_key" ON "accounts"("username");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_phone_number_key" ON "accounts"("phone_number");

-- CreateIndex
CREATE UNIQUE INDEX "roles_role_name_key" ON "roles"("role_name");

-- CreateIndex
CREATE UNIQUE INDEX "vehicle_amenities_amenity_name_key" ON "vehicle_amenities"("amenity_name");

-- CreateIndex
CREATE INDEX "vehicle_images_is_primary_idx" ON "vehicle_images"("is_primary");

-- AddForeignKey
ALTER TABLE "account_roles" ADD CONSTRAINT "account_roles_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("account_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account_roles" ADD CONSTRAINT "account_roles_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("role_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vehicles" ADD CONSTRAINT "vehicles_lessor_id_fkey" FOREIGN KEY ("lessor_id") REFERENCES "accounts"("account_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "vehicles"("vehicle_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_renter_id_fkey" FOREIGN KEY ("renter_id") REFERENCES "accounts"("account_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vehicle_amenity_mapping" ADD CONSTRAINT "vehicle_amenity_mapping_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "vehicles"("vehicle_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vehicle_amenity_mapping" ADD CONSTRAINT "vehicle_amenity_mapping_amenity_id_fkey" FOREIGN KEY ("amenity_id") REFERENCES "vehicle_amenities"("amenity_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vehicle_images" ADD CONSTRAINT "vehicle_images_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "vehicles"("vehicle_id") ON DELETE CASCADE ON UPDATE CASCADE;
