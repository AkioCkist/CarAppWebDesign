import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient()

async function addSupercars() {
    try {
        console.log('Adding supercars to database...')
        // Thêm các siêu xe mới (không chỉ định vehicle_id để sử dụng autoincrement)
        const supercarData = [
            {
                lessor_id: 3,
                name: 'Lamborghini Huracán 2024',
                rating: 4.9,
                total_trips: 25,
                location: 'TP.HCM - 123 Nguyễn Huệ, Quận 1',
                transmission: 'Số tự động',
                seats: 2,
                fuel_type: 'Xăng',
                base_price: 15000000.00,
                vehicle_type: 'supercar',
                description: 'Siêu xe Lamborghini Huracán với động cơ V10 mạnh mẽ, thiết kế thể thao đẳng cấp. Trải nghiệm lái xe đỉnh cao cho những chuyến đi đặc biệt.',
                status: 'available',
                is_favorite: true,
                created_at: new Date('2025-06-01T10:00:00.000Z'),
                updated_at: new Date('2025-06-08T10:00:00.000Z')
            },
            {
                lessor_id: 3,
                name: 'Porsche 911 GT3 RS 2024',
                rating: 5.0,
                total_trips: 15,
                location: 'Hà Nội - 456 Hai Bà Trưng, Hoàn Kiếm',
                transmission: 'Số sàn 6 cấp',
                seats: 2,
                fuel_type: 'Xăng',
                base_price: 18000000.00,
                vehicle_type: 'supercar',
                description: 'Porsche 911 GT3 RS - đỉnh cao của công nghệ đua xe đường phố. Động cơ 4.0L tự nhiên hút khí, cảm giác lái thuần túy nhất.',
                status: 'available',
                is_favorite: true,
                created_at: new Date('2025-06-01T11:00:00.000Z'),
                updated_at: new Date('2025-06-08T11:00:00.000Z')
            },
            {
                lessor_id: 3,
                name: 'Maserati MC20 2024',
                rating: 4.8,
                total_trips: 20,
                location: 'Đà Nẵng - 789 Lê Duẩn, Hải Châu',
                transmission: 'Số tự động 8 cấp',
                seats: 2,
                fuel_type: 'Xăng',
                base_price: 16000000.00,
                vehicle_type: 'supercar',
                description: 'Maserati MC20 với động cơ V6 twin-turbo 630 mã lực. Sự kết hợp hoàn hảo giữa sang trọng Italia và hiệu suất đua xe.',
                status: 'available',
                is_favorite: false,
                created_at: new Date('2025-06-01T12:00:00.000Z'),
                updated_at: new Date('2025-06-08T12:00:00.000Z')
            },
            {
                lessor_id: 3,
                name: 'Ferrari 488 GTB 2024',
                rating: 4.95,
                total_trips: 18,
                location: 'TP.HCM - 321 Lê Lợi, Quận 1',
                transmission: 'Số tự động 7 cấp',
                seats: 2,
                fuel_type: 'Xăng',
                base_price: 20000000.00,
                vehicle_type: 'supercar',
                description: 'Ferrari 488 GTB - biểu tượng của tốc độ và đam mê. Động cơ V8 twin-turbo 3.9L, âm thanh Ferrari đặc trưng không thể nhầm lẫn.',
                status: 'available',
                is_favorite: true,
                created_at: new Date('2025-06-01T13:00:00.000Z'),
                updated_at: new Date('2025-06-08T13:00:00.000Z')
            },
            {
                lessor_id: 3,
                name: 'McLaren 720S 2024',
                rating: 4.9,
                total_trips: 12,
                location: 'Hà Nội - 654 Láng Hạ, Đống Đa',
                transmission: 'Số tự động 7 cấp',
                seats: 2,
                fuel_type: 'Xăng',
                base_price: 17500000.00,
                vehicle_type: 'supercar',
                description: 'McLaren 720S với công nghệ khí động học tiên tiến và động cơ V8 twin-turbo 4.0L. Hiệu suất vượt trội với thiết kế tương lai.',
                status: 'available',
                is_favorite: true,
                created_at: new Date('2025-06-01T14:00:00.000Z'),
                updated_at: new Date('2025-06-08T14:00:00.000Z')
            },
            {
                lessor_id: 3,
                name: 'Aston Martin DB11 V12 2024',
                rating: 4.85,
                total_trips: 22,
                location: 'Huế - 987 Phạm Ngũ Lão, Huế',
                transmission: 'Số tự động 8 cấp',
                seats: 4,
                fuel_type: 'Xăng',
                base_price: 14000000.00,
                vehicle_type: 'luxury',
                description: 'Aston Martin DB11 V12 - GT cao cấp với phong cách Anh quốc thanh lịch. Động cơ V12 twin-turbo 5.2L mạnh mẽ và êm ái.',
                status: 'available',
                is_favorite: false,
                created_at: new Date('2025-06-01T15:00:00.000Z'),
                updated_at: new Date('2025-06-08T15:00:00.000Z')
            },
            {
                lessor_id: 3,
                name: 'Bentley Continental GT 2024',
                rating: 4.8,
                total_trips: 28,
                location: 'TP.HCM - 159 Đồng Khởi, Quận 1',
                transmission: 'Số tự động 8 cấp',
                seats: 4,
                fuel_type: 'Xăng',
                base_price: 13000000.00,
                vehicle_type: 'luxury',
                description: 'Bentley Continental GT - sự kết hợp hoàn hảo giữa hiệu suất cao và sang trọng tuyệt đối. Nội thất thủ công cao cấp.',
                status: 'available',
                is_favorite: false,
                created_at: new Date('2025-06-01T16:00:00.000Z'),
                updated_at: new Date('2025-06-08T16:00:00.000Z')
            },
            {
                lessor_id: 3,
                name: 'Lamborghini Aventador SVJ 2024',
                rating: 5.0,
                total_trips: 8,
                location: 'Hà Nội - 777 Kim Mã, Ba Đình',
                transmission: 'Số tự động 7 cấp',
                seats: 2,
                fuel_type: 'Xăng',
                base_price: 25000000.00,
                vehicle_type: 'supercar',
                description: 'Lamborghini Aventador SVJ - đỉnh cao của dòng Aventador với khí động học tích cực. Động cơ V12 tự nhiên 6.5L, âm thanh đầy cảm xúc.',
                status: 'available',
                is_favorite: true,
                created_at: new Date('2025-06-01T17:00:00.000Z'),
                updated_at: new Date('2025-06-08T17:00:00.000Z')
            }
        ]

        // Thêm tất cả xe cùng lúc với createMany
        const vehiclesResult = await prisma.vehicles.createMany({
            data: supercarData,
            skipDuplicates: true
        })
        console.log(`✓ Created ${vehiclesResult.count} supercars successfully!`)

        // Lấy các vehicle_id của xe vừa thêm (dựa trên created_at để xác định)
        const createdVehicles = await prisma.vehicles.findMany({
            where: {
                created_at: { in: supercarData.map(v => v.created_at) }
            }
        })

        // Thêm amenities mapping cho siêu xe
        const supercarAmenities = []
        createdVehicles.forEach(vehicle => {
            supercarAmenities.push(
                { vehicle_id: vehicle.vehicle_id, amenity_id: 1 }, // bluetooth
                { vehicle_id: vehicle.vehicle_id, amenity_id: 2 }, // camera
                { vehicle_id: vehicle.vehicle_id, amenity_id: 3 }, // airbag
                { vehicle_id: vehicle.vehicle_id, amenity_id: 5 }, // sunroof
                { vehicle_id: vehicle.vehicle_id, amenity_id: 6 }, // sportMode
                { vehicle_id: vehicle.vehicle_id, amenity_id: 7 }, // tablet
                { vehicle_id: vehicle.vehicle_id, amenity_id: 8 }, // camera360
                { vehicle_id: vehicle.vehicle_id, amenity_id: 9 }, // map
                { vehicle_id: vehicle.vehicle_id, amenity_id: 11 }, // collision sensor
                { vehicle_id: vehicle.vehicle_id, amenity_id: 13 }, // anti-theft
                { vehicle_id: vehicle.vehicle_id, amenity_id: 14 }  // blind spot warning
            )
        })

        if (supercarAmenities.length > 0) {
            await prisma.vehicle_amenity_mapping.createMany({
                data: supercarAmenities,
                skipDuplicates: true
            })
            console.log('✓ Supercar amenities mapped successfully!')
        }

        // Thêm hình ảnh cho siêu xe
        const supercarImages = []
        createdVehicles.forEach((vehicle, index) => {
            const carNames = [
                'LamborghiniHuracan2024',
                'Porsche911GT3RS2024',
                'MaseratiMC202024',
                'Ferrari488GTB2024',
                'McLaren720S2024',
                'AstonMartinDB112024',
                'BentleyContinentalGT2024',
                'LamborghiniAventadorSVJ2024'
            ]
            
            const carName = carNames[index] || 'Supercar'
            
            supercarImages.push(
                { 
                    vehicle_id: vehicle.vehicle_id, 
                    image_url: `/cars/${carName}/1.png`, 
                    is_primary: true, 
                    display_order: 1,
                    created_at: new Date('2025-06-08T10:00:00.000Z')
                },
                { 
                    vehicle_id: vehicle.vehicle_id, 
                    image_url: `/cars/${carName}/2.png`, 
                    is_primary: false, 
                    display_order: 2,
                    created_at: new Date('2025-06-08T10:00:00.000Z')
                },
                { 
                    vehicle_id: vehicle.vehicle_id, 
                    image_url: `/cars/${carName}/3.png`, 
                    is_primary: false, 
                    display_order: 3,
                    created_at: new Date('2025-06-08T10:00:00.000Z')
                }
            )
        })

        if (supercarImages.length > 0) {
            await prisma.vehicle_images.createMany({
                data: supercarImages,
                skipDuplicates: true
            })
            console.log('✓ Supercar images added successfully!')
        }

        console.log('🎉 All supercars data added successfully!')
        console.log(`Added ${vehiclesResult.count} supercars with amenities and images`)

    } catch (error) {
        console.error('Error adding supercars:', error)
        throw error
    } finally {
        await prisma.$disconnect()
    }
}

addSupercars()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })