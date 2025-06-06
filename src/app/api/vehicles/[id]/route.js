import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req, { params }) {
    const id = Number(params.id);
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    try {
        const vehicle = await prisma.vehicles.findUnique({
            where: { vehicle_id: id },
            include: {
                vehicle_images: true,
                vehicle_amenity_mapping: {
                    include: { amenity: true }
                },
                lessor: true
            }
        });

        if (!vehicle) return NextResponse.json({ error: 'Not found' }, { status: 404 });

        // Map amenities
        const amenities = vehicle.vehicle_amenity_mapping.map(m => ({
            name: m.amenity.amenity_name,
            icon: m.amenity.amenity_icon,
            description: m.amenity.description
        }));

        // Map images
        const images = vehicle.vehicle_images
            .sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
            .map(img => ({
                url: img.image_url,
                is_primary: img.is_primary,
                order_display: img.display_order
            }));

        // Map data về format CarRentalModal cần
        const carDetail = {
            id: vehicle.vehicle_id,
            name: vehicle.name,
            rating: Number(vehicle.rating),
            trips: vehicle.total_trips,
            location: vehicle.location,
            transmission: vehicle.transmission,
            seats: vehicle.seats,
            fuel: vehicle.fuel_type,
            base_price: Number(vehicle.base_price),
            priceDisplay: `${(Number(vehicle.base_price) / 1000).toFixed(0)}K/ngày`,
            vehicle_type: vehicle.vehicle_type,
            description: vehicle.description,
            status: vehicle.status,
            is_favorite: vehicle.is_favorite,
            lessor_name: vehicle.lessor?.username,
            image: images[0]?.url || "/images/default-car.jpg",
            images,
            amenities,
            created_at: vehicle.created_at,
            updated_at: vehicle.updated_at
        };

        return NextResponse.json(carDetail);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch vehicle detail' }, { status: 500 });
    }
}