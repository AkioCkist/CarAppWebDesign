import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request) {
    // Lấy query param nếu cần (ví dụ: status, location, type...)
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'available';

    try {
        const vehicles = await prisma.vehicles.findMany({
            where: { status }, // Chỉ lấy xe available
            include: {
                vehicle_images: true,
                vehicle_amenity_mapping: {
                    include: { amenity: true }
                },
                lessor: true
            }
        });
        return NextResponse.json({ vehicles });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch vehicles' }, { status: 500 });
    }
}