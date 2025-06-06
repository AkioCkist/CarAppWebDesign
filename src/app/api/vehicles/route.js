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

function normalizeCity(str) {
    if (!str) return "";
    str = str.toLowerCase().trim();
    str = str.normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // bỏ dấu tiếng Việt
    str = str.replace(/tp\.?\s*hcm|thanh pho ho chi minh|ho chi minh/g, "hcm");
    str = str.replace(/ha noi/g, "hanoi");
    str = str.replace(/da nang/g, "danang");
    str = str.replace(/hue/g, "hue");
    str = str.replace(/bac ninh/g, "bacninh");
    return str;
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
    if (location) {
        // Lấy tất cả xe rồi lọc bằng JS (nếu dữ liệu ít)
        const allVehicles = await prisma.vehicles.findMany({
            where: { status: statusFilter },
            include: {
                lessor: true,
                vehicle_images: { orderBy: [{ is_primary: 'desc' }, { display_order: 'asc' }] },
                vehicle_amenity_mapping: { include: { amenity: true } }
            }
        });
        const filtered = allVehicles.filter(v => {
            const cityRaw = v.location?.split('-')[0]?.trim();
            return normalizeCity(cityRaw) === normalizeCity(location);
        });
        const vehiclesFormatted = filtered.map(vehicle => formatVehicleData(vehicle));
        return NextResponse.json({ records: vehiclesFormatted, total: vehiclesFormatted.length });
    }
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

// Cập nhật trạng thái xe
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
            data: { status: status }
        })
        
        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json(
            { success: false, error: error.message }, 
            { status: 500 }
        )
    }
}

// Toggle favorite
async function toggleFavorite(data) {
    const { vehicle_id, is_favorite = true } = data
    
    if (!vehicle_id) {
        return NextResponse.json(
            { message: "vehicle_id là bắt buộc." }, 
            { status: 400 }
        )
    }
    
    try {
        await prisma.vehicles.update({
            where: { vehicle_id: parseInt(vehicle_id) },
            data: { is_favorite: is_favorite }
        })
        
        return NextResponse.json({ 
            message: "Đã cập nhật trạng thái yêu thích." 
        })
    } catch (error) {
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