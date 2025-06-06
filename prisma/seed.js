const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    try {
        console.log('Seeding database...')

        // Clean existing data (optional - remove if you want to preserve existing data)
        await prisma.vehicle_amenity_mapping.deleteMany()
        await prisma.vehicle_images.deleteMany()
        await prisma.bookings.deleteMany()
        await prisma.vehicles.deleteMany()
        await prisma.vehicle_amenities.deleteMany()
        await prisma.account_roles.deleteMany()
        await prisma.accounts.deleteMany()
        await prisma.roles.deleteMany()

        // Seed roles
        const roles = await prisma.roles.createMany({
            data: [
                { role_id: 1, role_name: 'renter' },
                { role_id: 2, role_name: 'lessor' },
                { role_id: 3, role_name: 'administrator' }
            ]
        })
        console.log('✓ Roles seeded')

        // Seed accounts
        const accounts = await prisma.accounts.createMany({
            data: [
                {
                    account_id: 1,
                    username: 'abc',
                    phone_number: '0982742410',
                    password: '$2y$10$D3doWLw7atAtnhgBrGcm7O2TvxnsqqGM0N8cASy9btdbkBisvZ5Wu',
                    created_at: new Date('2025-05-28T15:48:03.000Z')
                },
                {
                    account_id: 2,
                    username: 'cac',
                    phone_number: '0123456789',
                    password: '$2y$10$rpqLOsIkKMDRsbkL5CvI5ehDUvsMQv4MF485lLveUgcqV/qVPpygG',
                    created_at: new Date('2025-05-29T02:08:53.000Z')
                },
                {
                    account_id: 3,
                    username: 'lessor1',
                    phone_number: '0987654321',
                    password: '$2y$10$8Vc81s1FWpPUx/yjZgc5s./3zEPunW/lSmIJ8OSB2C3D8kaSbPml.',
                    created_at: new Date('2025-05-30T10:00:00.000Z')
                }
            ]
        })
        console.log('✓ Accounts seeded')

        // Seed account_roles
        const accountRoles = await prisma.account_roles.createMany({
            data: [
                { account_id: 1, role_id: 1 },
                { account_id: 2, role_id: 1 },
                { account_id: 3, role_id: 2 }
            ]
        })
        console.log('✓ Account roles seeded')

        // Seed vehicles
        const vehicles = await prisma.vehicles.createMany({
            data: [
                {
                    vehicle_id: 1,
                    lessor_id: 3,
                    name: 'Toyota Vios 2023',
                    rating: 4.8,
                    total_trips: 125,
                    location: 'TP.HCM - 456 Lê Văn Sỹ, Phường 14, Quận 3',
                    transmission: 'Số tự động',
                    seats: 4,
                    fuel_type: 'Xăng',
                    base_price: 900000.00,
                    vehicle_type: 'sedan',
                    description: 'Xe gia đình tiết kiệm nhiên liệu, phù hợp cho di chuyển trong thành phố và du lịch ngắn ngày.',
                    status: 'available',
                    is_favorite: true,
                    created_at: new Date('2025-05-01T08:00:00.000Z'),
                    updated_at: new Date('2025-05-31T09:00:00.000Z')
                },
                {
                    vehicle_id: 2,
                    lessor_id: 3,
                    name: 'Honda CR-V 2024',
                    rating: 4.9,
                    total_trips: 180,
                    location: 'Hà Nội - 123 Trần Phú, Ba Đình, Hà Nội',
                    transmission: 'Số tự động',
                    seats: 7,
                    fuel_type: 'Xăng',
                    base_price: 1500000.00,
                    vehicle_type: 'suv',
                    description: 'SUV rộng rãi, phù hợp cho gia đình và du lịch xa.',
                    status: 'rented',
                    is_favorite: false,
                    created_at: new Date('2025-05-02T09:00:00.000Z'),
                    updated_at: new Date('2025-05-31T10:00:00.000Z')
                },
                {
                    vehicle_id: 3,
                    lessor_id: 3,
                    name: 'Kia Morning 2022',
                    rating: 4.5,
                    total_trips: 200,
                    location: 'Đà Nẵng - 567 Nguyễn Văn Linh, Hải Châu, Đà Nẵng',
                    transmission: 'Số sàn',
                    seats: 4,
                    fuel_type: 'Xăng',
                    base_price: 500000.00,
                    vehicle_type: 'hatchback',
                    description: 'Xe nhỏ gọn, tiết kiệm, lý tưởng cho di chuyển nội đô.',
                    status: 'available',
                    is_favorite: false,
                    created_at: new Date('2025-05-03T07:00:00.000Z'),
                    updated_at: new Date('2025-05-31T08:00:00.000Z')
                },
                {
                    vehicle_id: 4,
                    lessor_id: 3,
                    name: 'Mazda CX-5 2023',
                    rating: 4.7,
                    total_trips: 150,
                    location: 'Huế - 234 Lê Lợi, Phú Hậu, Huế',
                    transmission: 'Số tự động',
                    seats: 5,
                    fuel_type: 'Xăng',
                    base_price: 1200000.00,
                    vehicle_type: 'crossover',
                    description: 'Xe crossover mạnh mẽ, phong cách, phù hợp mọi địa hình.',
                    status: 'available',
                    is_favorite: true,
                    created_at: new Date('2025-05-04T06:00:00.000Z'),
                    updated_at: new Date('2025-06-02T15:14:04.000Z')
                },
                {
                    vehicle_id: 5,
                    lessor_id: 3,
                    name: 'Ford Ranger 2024',
                    rating: 4.6,
                    total_trips: 90,
                    location: 'Bắc Ninh - 789 Nguyễn Trãi, Suối Hoa, Bắc Ninh',
                    transmission: 'Số tự động',
                    seats: 5,
                    fuel_type: 'Dầu',
                    base_price: 1800000.00,
                    vehicle_type: 'pickup',
                    description: 'Xe bán tải mạnh mẽ, phù hợp cho công việc và du lịch địa hình.',
                    status: 'available',
                    is_favorite: false,
                    created_at: new Date('2025-05-05T05:00:00.000Z'),
                    updated_at: new Date('2025-05-31T06:00:00.000Z')
                }
            ]
        })
        console.log('✓ Vehicles seeded')

        // Seed bookings
        const bookings = await prisma.bookings.createMany({
            data: [
                {
                    booking_id: 1,
                    vehicle_id: 1,
                    renter_id: 1,
                    pickup_date: new Date('2025-06-15'),
                    pickup_time: new Date('1970-01-01T09:00:00.000Z'),
                    return_date: new Date('2025-06-17'),
                    return_time: new Date('1970-01-01T18:00:00.000Z'),
                    pickup_location: 'TP.HCM - 456 Lê Văn Sỹ, Phường 14, Quận 3',
                    return_location: 'TP.HCM - 456 Lê Văn Sỹ, Phường 14, Quận 3',
                    total_price: 1800000.00,
                    discount_applied: 270000.00,
                    final_price: 1530000.00,
                    status: 'confirmed',
                    created_at: new Date('2025-06-01T10:30:00.000Z'),
                    updated_at: new Date('2025-06-01T10:30:00.000Z')
                },
                {
                    booking_id: 2,
                    vehicle_id: 2,
                    renter_id: 2,
                    pickup_date: new Date('2025-05-20'),
                    pickup_time: new Date('1970-01-01T08:00:00.000Z'),
                    return_date: new Date('2025-05-25'),
                    return_time: new Date('1970-01-01T17:00:00.000Z'),
                    pickup_location: 'Hà Nội - 123 Trần Phú, Ba Đình, Hà Nội',
                    return_location: 'Hà Nội - 123 Trần Phú, Ba Đình, Hà Nội',
                    total_price: 7500000.00,
                    discount_applied: 1500000.00,
                    final_price: 6000000.00,
                    status: 'completed',
                    created_at: new Date('2025-05-10T09:00:00.000Z'),
                    updated_at: new Date('2025-05-25T17:00:00.000Z')
                },
                {
                    booking_id: 3,
                    vehicle_id: 3,
                    renter_id: 1,
                    pickup_date: new Date('2025-06-01'),
                    pickup_time: new Date('1970-01-01T10:00:00.000Z'),
                    return_date: new Date('2025-06-02'),
                    return_time: new Date('1970-01-01T10:00:00.000Z'),
                    pickup_location: 'Đà Nẵng - 567 Nguyễn Văn Linh, Hải Châu, Đà Nẵng',
                    return_location: 'Đà Nẵng - 567 Nguyễn Văn Linh, Hải Châu, Đà Nẵng',
                    total_price: 500000.00,
                    discount_applied: 50000.00,
                    final_price: 450000.00,
                    status: 'ongoing',
                    created_at: new Date('2025-05-25T08:00:00.000Z'),
                    updated_at: new Date('2025-05-31T10:00:00.000Z')
                },
                {
                    booking_id: 4,
                    vehicle_id: 4,
                    renter_id: 2,
                    pickup_date: new Date('2025-07-01'),
                    pickup_time: new Date('1970-01-01T14:00:00.000Z'),
                    return_date: new Date('2025-07-03'),
                    return_time: new Date('1970-01-01T14:00:00.000Z'),
                    pickup_location: 'Huế - 234 Lê Lợi, Phú Hậu, Huế',
                    return_location: 'Huế - 234 Lê Lợi, Phú Hậu, Huế',
                    total_price: 2400000.00,
                    discount_applied: 360000.00,
                    final_price: 2040000.00,
                    status: 'pending',
                    created_at: new Date('2025-06-20T12:00:00.000Z'),
                    updated_at: new Date('2025-06-20T12:00:00.000Z')
                },
                {
                    booking_id: 5,
                    vehicle_id: 5,
                    renter_id: 1,
                    pickup_date: new Date('2025-05-15'),
                    pickup_time: new Date('1970-01-01T07:00:00.000Z'),
                    return_date: new Date('2025-05-17'),
                    return_time: new Date('1970-01-01T19:00:00.000Z'),
                    pickup_location: 'Bắc Ninh - 789 Nguyễn Trãi, Suối Hoa, Bắc Ninh',
                    return_location: 'Bắc Ninh - 789 Nguyễn Trãi, Suối Hoa, Bắc Ninh',
                    total_price: 3600000.00,
                    discount_applied: 900000.00,
                    final_price: 2700000.00,
                    status: 'completed',
                    created_at: new Date('2025-05-01T15:00:00.000Z'),
                    updated_at: new Date('2025-05-17T19:00:00.000Z')
                },
                {
                    booking_id: 6,
                    vehicle_id: 1,
                    renter_id: 2,
                    pickup_date: new Date('2025-06-20'),
                    pickup_time: new Date('1970-01-01T11:00:00.000Z'),
                    return_date: new Date('2025-06-21'),
                    return_time: new Date('1970-01-01T11:00:00.000Z'),
                    pickup_location: 'TP.HCM - 456 Lê Văn Sỹ, Phường 14, Quận 3',
                    return_location: 'TP.HCM - 456 Lê Văn Sỹ, Phường 14, Quận 3',
                    total_price: 900000.00,
                    discount_applied: 90000.00,
                    final_price: 810000.00,
                    status: 'confirmed',
                    created_at: new Date('2025-06-10T14:00:00.000Z'),
                    updated_at: new Date('2025-06-10T14:00:00.000Z')
                },
                {
                    booking_id: 7,
                    vehicle_id: 2,
                    renter_id: 1,
                    pickup_date: new Date('2025-06-10'),
                    pickup_time: new Date('1970-01-01T09:00:00.000Z'),
                    return_date: new Date('2025-06-12'),
                    return_time: new Date('1970-01-01T18:00:00.000Z'),
                    pickup_location: 'Hà Nội - 123 Trần Phú, Ba Đình, Hà Nội',
                    return_location: 'Hà Nội - 123 Trần Phú, Ba Đình, Hà Nội',
                    total_price: 3000000.00,
                    discount_applied: 300000.00,
                    final_price: 2700000.00,
                    status: 'cancelled',
                    created_at: new Date('2025-06-01T11:00:00.000Z'),
                    updated_at: new Date('2025-06-05T09:00:00.000Z')
                },
                {
                    booking_id: 8,
                    vehicle_id: 3,
                    renter_id: 2,
                    pickup_date: new Date('2025-07-05'),
                    pickup_time: new Date('1970-01-01T08:00:00.000Z'),
                    return_date: new Date('2025-07-07'),
                    return_time: new Date('1970-01-01T17:00:00.000Z'),
                    pickup_location: 'Đà Nẵng - 567 Nguyễn Văn Linh, Hải Châu, Đà Nẵng',
                    return_location: 'Đà Nẵng - 567 Nguyễn Văn Linh, Hải Châu, Đà Nẵng',
                    total_price: 1000000.00,
                    discount_applied: 100000.00,
                    final_price: 900000.00,
                    status: 'pending',
                    created_at: new Date('2025-06-25T10:00:00.000Z'),
                    updated_at: new Date('2025-06-25T10:00:00.000Z')
                },
                {
                    booking_id: 9,
                    vehicle_id: 4,
                    renter_id: 1,
                    pickup_date: new Date('2025-06-25'),
                    pickup_time: new Date('1970-01-01T12:00:00.000Z'),
                    return_date: new Date('2025-06-30'),
                    return_time: new Date('1970-01-01T12:00:00.000Z'),
                    pickup_location: 'Huế - 234 Lê Lợi, Phú Hậu, Huế',
                    return_location: 'Huế - 234 Lê Lợi, Phú Hậu, Huế',
                    total_price: 6000000.00,
                    discount_applied: 1200000.00,
                    final_price: 4800000.00,
                    status: 'confirmed',
                    created_at: new Date('2025-06-15T13:00:00.000Z'),
                    updated_at: new Date('2025-06-15T13:00:00.000Z')
                },
                {
                    booking_id: 10,
                    vehicle_id: 5,
                    renter_id: 2,
                    pickup_date: new Date('2025-06-01'),
                    pickup_time: new Date('1970-01-01T15:00:00.000Z'),
                    return_date: new Date('2025-06-03'),
                    return_time: new Date('1970-01-01T15:00:00.000Z'),
                    pickup_location: 'Bắc Ninh - 789 Nguyễn Trãi, Suối Hoa, Bắc Ninh',
                    return_location: 'Bắc Ninh - 789 Nguyễn Trãi, Suối Hoa, Bắc Ninh',
                    total_price: 3600000.00,
                    discount_applied: 900000.00,
                    final_price: 2700000.00,
                    status: 'ongoing',
                    created_at: new Date('2025-05-20T16:00:00.000Z'),
                    updated_at: new Date('2025-05-31T16:00:00.000Z')
                }
            ]
        })
        console.log('✓ Bookings seeded')

        // Seed vehicle_amenities
        const vehicleAmenities = await prisma.vehicle_amenities.createMany({
            data: [
                { amenity_id: 1, amenity_name: 'bluetooth', amenity_icon: 'bluetooth', description: 'Kết nối Bluetooth' },
                { amenity_id: 2, amenity_name: 'camera', amenity_icon: 'camera', description: 'Camera lùi' },
                { amenity_id: 3, amenity_name: 'airbag', amenity_icon: 'airbag', description: 'Túi khí an toàn' },
                { amenity_id: 4, amenity_name: 'etc', amenity_icon: 'etc', description: 'Hệ thống thu phí tự động' },
                { amenity_id: 5, amenity_name: 'sunroof', amenity_icon: 'sunroof', description: 'Cửa sổ trời' },
                { amenity_id: 6, amenity_name: 'sportMode', amenity_icon: 'sportMode', description: 'Chế độ lái thể thao' },
                { amenity_id: 7, amenity_name: 'tablet', amenity_icon: 'tablet', description: 'Màn hình giải trí' },
                { amenity_id: 8, amenity_name: 'camera360', amenity_icon: 'camera360', description: 'Camera toàn cảnh 360 độ' },
                { amenity_id: 9, amenity_name: 'map', amenity_icon: 'map', description: 'Hệ thống định vị GPS' },
                { amenity_id: 10, amenity_name: 'rotateCcw', amenity_icon: 'rotateCcw', description: 'Hỗ trợ lùi xe tự động' },
                { amenity_id: 11, amenity_name: 'circle', amenity_icon: 'circle', description: 'Cảm biến va chạm' },
                { amenity_id: 12, amenity_name: 'package', amenity_icon: 'package', description: 'Khoang hành lý rộng' },
                { amenity_id: 13, amenity_name: 'shield', amenity_icon: 'shield', description: 'Hệ thống chống trộm' },
                { amenity_id: 14, amenity_name: 'radar', amenity_icon: 'radar', description: 'Cảnh báo điểm mù' }
            ]
        })
        console.log('✓ Vehicle amenities seeded')

        // Seed vehicle_amenity_mapping
        const vehicleAmenityMapping = await prisma.vehicle_amenity_mapping.createMany({
            data: [
                { vehicle_id: 1, amenity_id: 1 },
                { vehicle_id: 2, amenity_id: 1 },
                { vehicle_id: 3, amenity_id: 1 },
                { vehicle_id: 4, amenity_id: 1 },
                { vehicle_id: 5, amenity_id: 1 },
                { vehicle_id: 1, amenity_id: 2 },
                { vehicle_id: 2, amenity_id: 2 },
                { vehicle_id: 3, amenity_id: 2 },
                { vehicle_id: 4, amenity_id: 2 },
                { vehicle_id: 1, amenity_id: 3 },
                { vehicle_id: 2, amenity_id: 3 },
                { vehicle_id: 4, amenity_id: 3 },
                { vehicle_id: 5, amenity_id: 3 },
                { vehicle_id: 1, amenity_id: 5 },
                { vehicle_id: 2, amenity_id: 5 },
                { vehicle_id: 1, amenity_id: 7 },
                { vehicle_id: 2, amenity_id: 7 },
                { vehicle_id: 2, amenity_id: 8 },
                { vehicle_id: 4, amenity_id: 8 },
                { vehicle_id: 3, amenity_id: 9 },
                { vehicle_id: 4, amenity_id: 11 },
                { vehicle_id: 5, amenity_id: 12 },
                { vehicle_id: 5, amenity_id: 13 },
                { vehicle_id: 5, amenity_id: 14 }
            ]
        })
        console.log('✓ Vehicle amenity mapping seeded')

        // Seed vehicle_images
        const vehicleImages = await prisma.vehicle_images.createMany({
            data: [
                { image_id: 1, vehicle_id: 1, image_url: '/cars/ToyotaVios2023/1.png', is_primary: true, display_order: 1, created_at: new Date('2025-05-01T08:00:00.000Z') },
                { image_id: 2, vehicle_id: 1, image_url: '/cars/FordRange2024/2.png', is_primary: false, display_order: 2, created_at: new Date('2025-05-01T08:00:00.000Z') },
                { image_id: 3, vehicle_id: 1, image_url: '/cars/ToyotaVios2023/3.png', is_primary: false, display_order: 3, created_at: new Date('2025-05-01T08:00:00.000Z') },
                { image_id: 4, vehicle_id: 2, image_url: 'https://example.com/car2_1.jpg', is_primary: true, display_order: 1, created_at: new Date('2025-05-02T09:00:00.000Z') },
                { image_id: 5, vehicle_id: 2, image_url: 'https://example.com/car2_2.jpg', is_primary: false, display_order: 2, created_at: new Date('2025-05-02T09:00:00.000Z') },
                { image_id: 6, vehicle_id: 3, image_url: '/cars/KiaMorning2022/1.png', is_primary: true, display_order: 1, created_at: new Date('2025-05-03T07:00:00.000Z') },
                { image_id: 7, vehicle_id: 4, image_url: '/cars/MazdaCx52023/1.png', is_primary: true, display_order: 1, created_at: new Date('2025-05-04T06:00:00.000Z') },
                { image_id: 8, vehicle_id: 4, image_url: '/cars/MazdaCx52023/2.png', is_primary: false, display_order: 2, created_at: new Date('2025-05-04T06:00:00.000Z') },
                { image_id: 9, vehicle_id: 5, image_url: '/cars/FordRange2024/1.png', is_primary: true, display_order: 1, created_at: new Date('2025-05-05T05:00:00.000Z') },
                { image_id: 10, vehicle_id: 5, image_url: '/cars/FordRange2024/2.png', is_primary: false, display_order: 2, created_at: new Date('2025-06-03T15:44:36.000Z') },
                { image_id: 11, vehicle_id: 1, image_url: '/cars/FordRange2024/1.png', is_primary: false, display_order: 4, created_at: new Date('2025-06-03T16:48:31.000Z') },
                { image_id: 12, vehicle_id: 5, image_url: '/cars/FordRange2024/3.png', is_primary: false, display_order: 3, created_at: new Date('2025-06-03T16:52:18.000Z') },
                { image_id: 13, vehicle_id: 3, image_url: '/cars/KiaMorning2022/2.png', is_primary: false, display_order: 2, created_at: new Date('2025-06-03T17:00:20.000Z') }
            ]
        })
        console.log('✓ Vehicle images seeded')

        console.log('🎉 Database seeded successfully!')

    } catch (error) {
        console.error('Error seeding database:', error)
        throw error
    } finally {
        await prisma.$disconnect()
    }
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })