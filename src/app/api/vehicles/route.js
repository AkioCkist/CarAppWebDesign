import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

let prisma
if (process.env.NODE_ENV === 'production') {
    prisma = new PrismaClient()
} else {
    if (!global.prisma) {
        global.prisma = new PrismaClient({
            datasources: {
                db: {
                    url: process.env.DATABASE_URL,
                },
            },
            log: ['query', 'info', 'warn', 'error'],
            errorFormat: 'pretty',
        })
    }
    prisma = global.prisma
}

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (id) {
            return await getVehicleDetail(parseInt(id))
        }
        return await getVehicles(searchParams)
    } catch (error) {
        console.error('GET Error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

// POST - Cập nhật trạng thái xe hoặc toggle favorite
export async function POST(request) {
    try {
        const body = await request.json()
        const { action } = body

        if (action === 'update_status') {
            return await updateVehicleStatus(body)
        } else if (action === 'toggle_favorite') {
            return await toggleFavorite(body)
        }

        return NextResponse.json(
            { error: 'Action không hợp lệ' },
            { status: 400 }
        )
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
async function getVehicles(searchParams) {
    try {
        // Xử lý tham số query
        const statusFilter = searchParams.get('status') || 'available'
        const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')) : undefined
        const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')) : undefined
        const favoritesOnly = searchParams.get('favorites') === 'true'

        let whereClause = {
            status: statusFilter
        }

        // Xử lý favorites
        if (favoritesOnly) {
            whereClause.is_favorite = true
        }

        // Price
        const priceMin = searchParams.get('priceMin');
        const priceMax = searchParams.get('priceMax');
        if (priceMin || priceMax) {
            whereClause.base_price = {};
            if (priceMin) whereClause.base_price.gte = parseFloat(priceMin);
            if (priceMax) whereClause.base_price.lte = parseFloat(priceMax);
        }

        // Seats
        const seats = searchParams.get('seats');
        if (seats) {
            whereClause.seats = {
                in: seats.split(',').map(s => parseInt(s))
            };
        }

        // Fuel
        const fuel = searchParams.get('fuel_type');
        if (fuel) {
            whereClause.fuel_type = {
                in: fuel.split(',').map(f => f.trim().toLowerCase())
            };
        }

        // Search term
        const search = searchParams.get('search');
        if (search) {
            whereClause.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } }
            ];
        }

        // Xử lý loại xe
        const carType = searchParams.get('vehicle_type');
        console.log('Filter loại xe (vehicle_type):', carType);
        if (carType) {
            whereClause.vehicle_type = {
                in: carType.split(',')
            };
        }
        
        // Location
        const location = searchParams.get('location');
        if (location) {
            whereClause.location = {
                contains: location,
                mode: 'insensitive'
            };
        }
        console.log('Điều kiện whereClause:', whereClause);

        const vehicles = await prisma.vehicles.findMany({
            where: whereClause,
            include: {
                lessor: {
                    select: {
                        username: true
                    }
                },
                vehicle_images: {
                    orderBy: [
                        { is_primary: 'desc' },
                        { display_order: 'asc' }
                    ]
                },
                vehicle_amenity_mapping: {
                    include: {
                        amenity: {
                            select: {
                                amenity_name: true,
                                amenity_icon: true,
                                description: true
                            }
                        }
                    }
                }
            },
            take: parseInt(searchParams.get('limit')) || undefined,
            skip: parseInt(searchParams.get('offset')) || undefined,
            orderBy: [
                { rating: 'desc' },
                { created_at: 'desc' }]
        })
        const total = vehicles.length

        if (total > 0) {
            const vehiclesFormatted = vehicles.map(vehicle => formatVehicleData(vehicle))

            return NextResponse.json({
                records: vehiclesFormatted,
                total
            })
        } else {
            return NextResponse.json({
                message: "Không tìm thấy xe nào.",
                records: [],
                total: 0
            })
        }
    } catch (error) {
        console.error('getVehicles Error:', error)
        return NextResponse.json({
            message: "Lỗi server: " + error.message
        }, { status: 500 })
    }
}

async function getVehicleDetail(id) {
    try {
        const vehicle = await prisma.vehicles.findFirst({
            where: {
                vehicle_id: id,
                status: 'available'
            },
            include: {
                lessor: {
                    select: {
                        username: true
                    }
                },
                vehicle_images: {
                    orderBy: [
                        { is_primary: 'desc' },
                        { display_order: 'asc' }
                    ]
                },
                vehicle_amenity_mapping: {
                    include: {
                        amenity: {
                            select: {
                                amenity_name: true,
                                amenity_icon: true,
                                description: true
                            }
                        }
                    }
                }
            }
        })

        if (!vehicle) {
            return NextResponse.json({
                message: 'Không tìm thấy xe.'
            }, { status: 404 })
        }

        return NextResponse.json(formatVehicleData(vehicle))
    } catch (error) {
        console.error('getVehicleDetail Error:', error)
        return NextResponse.json({
            message: "Lỗi server: " + error.message
        }, { status: 500 })
    }
}

async function updateVehicleStatus(data) {
    const { vehicle_id, status = 'rented' } = data

    if (!vehicle_id) {
        return NextResponse.json(
            { success: false, error: 'vehicle_id là bắt buộc' },
            { status: 400 }
        )
    }

    try {
        await prisma.vehicles.update({
            where: { vehicle_id: parseInt(vehicle_id) },
            data: {
                status: status,
                updated_at: new Date()
            }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('updateVehicleStatus Error:', error)
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        )
    }
}

async function toggleFavorite(data) {
    const { vehicle_id, is_favorite = true } = data

    if (!vehicle_id) {
        return NextResponse.json(
            { message: "Dữ liệu không hợp lệ." },
            { status: 400 }
        )
    }

    try {
        await prisma.vehicles.update({
            where: { vehicle_id: parseInt(vehicle_id) },
            data: {
                is_favorite: is_favorite,
                updated_at: new Date()
            }
        })

        return NextResponse.json({
            message: "Đã cập nhật trạng thái yêu thích."
        })
    } catch (error) {
        console.error('toggleFavorite Error:', error)
        return NextResponse.json(
            { message: "Không thể cập nhật trạng thái yêu thích." },
            { status: 503 }
        )
    }
}

function formatVehicleData(vehicle) {
    const images = (vehicle.vehicle_images || []).map(img => ({
        url: img.image_url,
        is_primary: img.is_primary,
        display_order: img.display_order
    }))
    const amenities = (vehicle.vehicle_amenity_mapping || []).map(mapping => ({
        name: mapping.amenity.amenity_name,
        icon: mapping.amenity.amenity_icon,
        description: mapping.amenity.description
    }))
    const priceDisplay = Math.floor(Number(vehicle.base_price) / 1000) + 'K/ngày'
    let oldPrice = null
    let priceDiscount = null
    if (Number(vehicle.rating) >= 4.8) {
        oldPrice = Number(vehicle.base_price) * 1.2
        priceDiscount = 'Giảm 20%'
    }
    return {
        id: vehicle.vehicle_id,
        name: vehicle.name,
        rating: parseFloat(vehicle.rating || 0),
        trips: parseInt(vehicle.total_trips || 0),
        location: vehicle.location,
        transmission: vehicle.transmission,
        seats: parseInt(vehicle.seats || 0),
        fuel: vehicle.fuel_type,
        fuel_type: vehicle.fuel_type,
        base_price: parseFloat(vehicle.base_price),
        priceDisplay,
        oldPrice,
        priceDiscount,
        pricePer: 'ngày',
        vehicle_type: vehicle.vehicle_type,
        description: vehicle.description,
        status: vehicle.status,
        is_favorite: !!vehicle.is_favorite,
        lessor_name: vehicle.lessor?.username || '',
        image: images.length > 0 ? images[0].url : '/images/default-car.jpg',
        images,
        amenities,
        created_at: vehicle.created_at,
        updated_at: vehicle.updated_at
    }
}