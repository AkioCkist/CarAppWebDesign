import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

let prisma
if (process.env.NODE_ENV === 'production') {
    prisma = new PrismaClient()
} else {
    if (!global.prisma) {
        global.prisma = new PrismaClient()
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
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

async function getVehicles(searchParams) {
    const statusFilter = searchParams.get('status') || 'available'
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')) : undefined
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')) : undefined
    const search = searchParams.get('search')
    const type = searchParams.get('type')
    const location = searchParams.get('location')
    const favoritesOnly = searchParams.get('favorites') === 'true'

    let whereClause = { status: statusFilter }
    if (search) {
        whereClause.OR = [
            { name: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
            { location: { contains: search, mode: 'insensitive' } }
        ]
    }
    if (type) whereClause.vehicle_type = type
    if (location) whereClause.location = { contains: location, mode: 'insensitive' }
    if (favoritesOnly) whereClause.is_favorite = true

    const vehicles = await prisma.vehicles.findMany({
        where: whereClause,
        include: {
            lessor: true,
            vehicle_images: { orderBy: [{ is_primary: 'desc' }, { display_order: 'asc' }] },
            vehicle_amenity_mapping: { include: { amenity: true } }
        },
        take: limit,
        skip: offset,
        orderBy: { created_at: 'desc' }
    })
    const total = await prisma.vehicles.count({ where: whereClause })

    const vehiclesFormatted = vehicles.map(vehicle => formatVehicleData(vehicle))
    return NextResponse.json({ records: vehiclesFormatted, total })
}

async function getVehicleDetail(id) {
    const vehicle = await prisma.vehicles.findUnique({
        where: { vehicle_id: id },
        include: {
            lessor: true,
            vehicle_images: { orderBy: [{ is_primary: 'desc' }, { display_order: 'asc' }] },
            vehicle_amenity_mapping: { include: { amenity: true } }
        }
    })
    if (!vehicle) {
        return NextResponse.json({ message: 'Không tìm thấy xe.' }, { status: 404 })
    }
    return NextResponse.json(formatVehicleData(vehicle))
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
    if (Number(vehicle.rating) >= 4.5) {
        oldPrice = Number(vehicle.base_price) * 1.2
        priceDiscount = 'Giảm 20%'
    }
    return {
        id: vehicle.vehicle_id,
        name: vehicle.name,
        rating: parseFloat(vehicle.rating),
        trips: parseInt(vehicle.total_trips),
        location: vehicle.location,
        transmission: vehicle.transmission,
        seats: parseInt(vehicle.seats),
        fuel: vehicle.fuel_type,
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