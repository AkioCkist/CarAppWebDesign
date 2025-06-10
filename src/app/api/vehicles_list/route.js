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
        const page = parseInt(searchParams.get('page')) || 1
        const limit = parseInt(searchParams.get('limit')) || 10
        const skip = (page - 1) * limit
        const status = searchParams.get('status')
        const search = searchParams.get('search')

        // Build where clause
        const whereClause = {}
        
        // Add status filter if specified
        if (status && status !== 'all') {
            whereClause.status = status
        }

        // Add search filter if specified
        if (search && search.trim()) {
            whereClause.OR = [
                { name: { contains: search.trim(), mode: 'insensitive' } },
                { description: { contains: search.trim(), mode: 'insensitive' } },
                { location: { contains: search.trim(), mode: 'insensitive' } }
            ]
        }

        // Get total count
        const total = await prisma.vehicles.count({
            where: whereClause
        })

        // Get paginated vehicles
        const vehicles = await prisma.vehicles.findMany({
            where: whereClause,
            orderBy: [
                { rating: 'desc' },
                { created_at: 'desc' }
            ],
            skip,
            take: limit,
            include: {
                vehicle_images: {
                    orderBy: [
                        { is_primary: 'desc' },
                        { display_order: 'asc' }
                    ],
                    take: 1
                },
                vehicle_amenity_mapping: {
                    include: {
                        amenity: true
                    }
                }
            }
        })

        return NextResponse.json({
            success: true,
            vehicles,
            total,
            page,
            limit
        })
    } catch (error) {
        console.error('Error in vehicles_list API:', error)
        return NextResponse.json({ success: false, error: error.message })
    }
}
