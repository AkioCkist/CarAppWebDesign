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
        const accountId = searchParams.get('id')

        if (!accountId) {
            return NextResponse.json(
                { error: 'Account ID is required' },
                { status: 400 }
            )
        }

        // Get user information with related data
        const user = await prisma.accounts.findUnique({
            where: {
                account_id: parseInt(accountId)
            },
            include: {
                account_roles: {
                    include: {
                        role: true
                    }
                },
                bookings: {
                    include: {
                        vehicle: {
                            include: {
                                vehicle_images: {
                                    where: {
                                        is_primary: true
                                    },
                                    take: 1
                                }
                            }
                        }
                    },
                    orderBy: {
                        created_at: 'desc'
                    }
                },
                favorites: {
                    include: {
                        vehicle: {
                            include: {
                                vehicle_images: {
                                    where: {
                                        is_primary: true
                                    },
                                    take: 1
                                }
                            }
                        }
                    },
                    orderBy: {
                        created_at: 'desc'
                    }
                },
                vehicles: {
                    include: {
                        vehicle_images: {
                            where: {
                                is_primary: true
                            },
                            take: 1
                        }
                    },
                    orderBy: {
                        created_at: 'desc'
                    }
                }
            }
        })

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            )
        }

        // Format the response
        const formattedUser = {
            id: user.account_id,
            username: user.username,
            phone_number: user.phone_number,
            created_at: user.created_at,
            roles: user.account_roles.map(ar => ar.role.role_name),
            bookings: user.bookings.map(booking => ({
                id: booking.booking_id,
                vehicle: {
                    id: booking.vehicle.vehicle_id,
                    name: booking.vehicle.name,
                    image: booking.vehicle.vehicle_images[0]?.image_url || '/images/default-car.jpg',
                    base_price: booking.vehicle.base_price
                },
                pickup_date: booking.pickup_date,
                return_date: booking.return_date,
                status: booking.status,
                total_price: booking.total_price,
                final_price: booking.final_price
            })),
            favorites: user.favorites.map(favorite => ({
                id: favorite.vehicle.vehicle_id,
                name: favorite.vehicle.name,
                image: favorite.vehicle.vehicle_images[0]?.image_url || '/images/default-car.jpg',
                base_price: favorite.vehicle.base_price,
                location: favorite.vehicle.location,
                rating: favorite.vehicle.rating
            })),
            vehicles: user.vehicles.map(vehicle => ({
                id: vehicle.vehicle_id,
                name: vehicle.name,
                image: vehicle.vehicle_images[0]?.image_url || '/images/default-car.jpg',
                base_price: vehicle.base_price,
                location: vehicle.location,
                status: vehicle.status,
                rating: vehicle.rating
            }))
        }

        return NextResponse.json({
            success: true,
            user: formattedUser
        })

    } catch (error) {
        console.error('Error in user API:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
