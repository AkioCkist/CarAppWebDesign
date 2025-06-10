import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const accountId = searchParams.get('account_id');

        if (!accountId) {
            return NextResponse.json(
                { error: 'Account ID is required' },
                { status: 400 }
            );
        }

        // Get user's favorite vehicles with all vehicle details
        const favorites = await prisma.favorites.findMany({
            where: {
                account_id: parseInt(accountId),
            },
            include: {
                vehicle: {
                    include: {
                        vehicle_images: {
                            where: {
                                is_primary: true,
                            },
                        },
                        lessor: {
                            select: {
                                username: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                created_at: 'desc',
            },
        });

        // Transform the data to match the expected format
        const formattedFavorites = favorites.map(favorite => {
            const vehicle = favorite.vehicle;
            const primaryImage = vehicle.vehicle_images[0];

            return {
                id: vehicle.vehicle_id,
                name: vehicle.name,
                image: primaryImage ? primaryImage.image_url : '/cars/default-car.jpg',
                transmission: vehicle.transmission || 'Manual',
                fuel: vehicle.fuel_type || 'Gasoline',
                seats: vehicle.seats || 4,
                location: vehicle.location || 'Unknown',
                rating: parseFloat(vehicle.rating) || 0,
                trips: vehicle.total_trips || 0,
                priceDisplay: `${Math.floor(vehicle.base_price / 1000)}K`,
                oldPrice: null,
                pricePer: 'day',
                priceDiscount: null,
                description: vehicle.description || '',
                isFavorite: true,
            };
        });

        return NextResponse.json({
            success: true,
            data: formattedFavorites,
        });

    } catch (error) {
        console.error('Error fetching favorites:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function POST(request) {
    try {
        const body = await request.json();
        const { account_id, vehicle_id } = body;

        if (!account_id || !vehicle_id) {
            return NextResponse.json(
                { error: 'Account ID and Vehicle ID are required' },
                { status: 400 }
            );
        }

        // Check if the favorite already exists
        const existingFavorite = await prisma.favorites.findUnique({
            where: {
                account_id_vehicle_id: {
                    account_id: parseInt(account_id),
                    vehicle_id: parseInt(vehicle_id),
                },
            },
        });

        if (existingFavorite) {
            // Remove from favorites
            await prisma.favorites.delete({
                where: {
                    id: existingFavorite.id,
                },
            });

            return NextResponse.json({
                success: true,
                action: 'removed',
                message: 'Vehicle removed from favorites',
            });
        } else {
            // Add to favorites
            await prisma.favorites.create({
                data: {
                    account_id: parseInt(account_id),
                    vehicle_id: parseInt(vehicle_id),
                },
            });

            return NextResponse.json({
                success: true,
                action: 'added',
                message: 'Vehicle added to favorites',
            });
        }

    } catch (error) {
        console.error('Error toggling favorite:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function DELETE(request) {
    try {
        const { searchParams } = new URL(request.url);
        const accountId = searchParams.get('account_id');
        const vehicleId = searchParams.get('vehicle_id');

        if (!accountId || !vehicleId) {
            return NextResponse.json(
                { error: 'Account ID and Vehicle ID are required' },
                { status: 400 }
            );
        }

        // Remove the favorite
        const deleted = await prisma.favorites.deleteMany({
            where: {
                account_id: parseInt(accountId),
                vehicle_id: parseInt(vehicleId),
            },
        });

        if (deleted.count === 0) {
            return NextResponse.json(
                { error: 'Favorite not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Vehicle removed from favorites',
        });

    } catch (error) {
        console.error('Error removing favorite:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
