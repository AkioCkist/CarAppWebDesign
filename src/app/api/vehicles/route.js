import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
    try {
        const vehicles = await prisma.vehicles.findMany({
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