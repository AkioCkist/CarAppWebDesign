-- CreateEnum
CREATE TYPE "VehicleStatus" AS ENUM ('available', 'rented', 'maintenance', 'inactive');

-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('pending', 'confirmed', 'ongoing', 'completed', 'cancelled');

-- CreateTable
CREATE TABLE "Account" (
    "account_id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "phone_number" TEXT,
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("account_id")
);

-- CreateTable
CREATE TABLE "Role" (
    "role_id" SERIAL NOT NULL,
    "role_name" TEXT NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("role_id")
);

-- CreateTable
CREATE TABLE "AccountRole" (
    "account_id" INTEGER NOT NULL,
    "role_id" INTEGER NOT NULL,

    CONSTRAINT "AccountRole_pkey" PRIMARY KEY ("account_id","role_id")
);

-- CreateTable
CREATE TABLE "Vehicle" (
    "vehicle_id" SERIAL NOT NULL,
    "lessor_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "rating" DECIMAL(65,30) DEFAULT 0.0,
    "total_trips" INTEGER DEFAULT 0,
    "location" TEXT NOT NULL,
    "transmission" TEXT,
    "seats" INTEGER,
    "fuel_type" TEXT,
    "base_price" DECIMAL(65,30) NOT NULL,
    "vehicle_type" TEXT,
    "description" TEXT,
    "status" "VehicleStatus" NOT NULL DEFAULT 'available',
    "is_favorite" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "Vehicle_pkey" PRIMARY KEY ("vehicle_id")
);

-- CreateTable
CREATE TABLE "Booking" (
    "booking_id" SERIAL NOT NULL,
    "vehicle_id" INTEGER NOT NULL,
    "renter_id" INTEGER NOT NULL,
    "pickup_date" TIMESTAMP(3) NOT NULL,
    "pickup_time" TIMESTAMP(3) NOT NULL,
    "return_date" TIMESTAMP(3) NOT NULL,
    "return_time" TIMESTAMP(3) NOT NULL,
    "pickup_location" TEXT NOT NULL,
    "return_location" TEXT NOT NULL,
    "total_price" DECIMAL(65,30) NOT NULL,
    "discount_applied" DECIMAL(65,30) DEFAULT 0.00,
    "final_price" DECIMAL(65,30) NOT NULL,
    "status" "BookingStatus" NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("booking_id")
);

-- CreateTable
CREATE TABLE "VehicleAmenity" (
    "amenity_id" SERIAL NOT NULL,
    "amenity_name" TEXT NOT NULL,
    "amenity_icon" TEXT,
    "description" TEXT,

    CONSTRAINT "VehicleAmenity_pkey" PRIMARY KEY ("amenity_id")
);

-- CreateTable
CREATE TABLE "VehicleAmenityMapping" (
    "vehicle_id" INTEGER NOT NULL,
    "amenity_id" INTEGER NOT NULL,

    CONSTRAINT "VehicleAmenityMapping_pkey" PRIMARY KEY ("vehicle_id","amenity_id")
);

-- CreateTable
CREATE TABLE "VehicleImage" (
    "image_id" SERIAL NOT NULL,
    "vehicle_id" INTEGER NOT NULL,
    "image_url" TEXT NOT NULL,
    "is_primary" BOOLEAN DEFAULT false,
    "display_order" INTEGER DEFAULT 0,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VehicleImage_pkey" PRIMARY KEY ("image_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_username_key" ON "Account"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Account_phone_number_key" ON "Account"("phone_number");

-- CreateIndex
CREATE UNIQUE INDEX "Role_role_name_key" ON "Role"("role_name");

-- CreateIndex
CREATE UNIQUE INDEX "VehicleAmenity_amenity_name_key" ON "VehicleAmenity"("amenity_name");

-- AddForeignKey
ALTER TABLE "AccountRole" ADD CONSTRAINT "AccountRole_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "Account"("account_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccountRole" ADD CONSTRAINT "AccountRole_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "Role"("role_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_lessor_id_fkey" FOREIGN KEY ("lessor_id") REFERENCES "Account"("account_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "Vehicle"("vehicle_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_renter_id_fkey" FOREIGN KEY ("renter_id") REFERENCES "Account"("account_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VehicleAmenityMapping" ADD CONSTRAINT "VehicleAmenityMapping_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "Vehicle"("vehicle_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VehicleAmenityMapping" ADD CONSTRAINT "VehicleAmenityMapping_amenity_id_fkey" FOREIGN KEY ("amenity_id") REFERENCES "VehicleAmenity"("amenity_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VehicleImage" ADD CONSTRAINT "VehicleImage_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "Vehicle"("vehicle_id") ON DELETE CASCADE ON UPDATE CASCADE;
