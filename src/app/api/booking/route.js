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
            return await getBookingDetail(safeParseInt(id))
        }
        return await getBookings(searchParams)
    } catch (error) {
        console.error('GET Error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}


export async function POST(request) {
    try {
        const body = await request.json()
        const { action } = body

        if (action === 'update_status') {
            return await updateBookingStatus(body)
        }

        if (action === 'create_booking') {
            return await createBooking(body)
        }

        return NextResponse.json(
            { error: 'Action không hợp lệ' },
            { status: 400 }
        )
    } catch (error) {
        console.error('POST Error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}


async function getBookings(searchParams) {
    try {
        const userId = searchParams.get('userId')
        const status = searchParams.get('status')
        const limit = searchParams.get('limit') ? safeParseInt(searchParams.get('limit')) : undefined
        const offset = searchParams.get('offset') ? safeParseInt(searchParams.get('offset')) : undefined

        let whereClause = {}
        if (userId) whereClause.renter_id = safeParseInt(userId)
        if (status) whereClause.status = status

        const [bookings, total] = await Promise.all([
            prisma.bookings.findMany({
                where: whereClause,
                include: {
                    vehicle: {
                        select: {
                            vehicle_id: true,
                            name: true,
                            base_price: true,
                            vehicle_type: true,
                            transmission: true,
                            seats: true,
                            location: true,
                            rating: true,
                            total_trips: true,
                            vehicle_images: {
                                where: { is_primary: true },
                                take: 1
                            }
                        }
                    },
                    renter: {
                        select: {
                            username: true,
                            phone_number: true,
                            account_id: true
                        }
                    }
                },
                orderBy: { created_at: 'desc' },
                take: limit,
                skip: offset
            }),
            prisma.bookings.count({ where: whereClause })
        ])

        console.log('Raw bookings data from Prisma:', bookings);

        if (bookings.length > 0) {
            const formattedBookings = bookings.map(booking => {
                const formattedBooking = formatBookingData(booking);
                console.log('Booking after formatBookingData:', formattedBooking);
                return formattedBooking;
            });
            return NextResponse.json({
                records: formattedBookings,
                total
            })
        } else {
            return NextResponse.json({
                message: "Không tìm thấy đơn đặt xe nào.",
                records: [],
                total: 0
            })
        }
    } catch (error) {
        console.error('getBookings Error:', error)
        return NextResponse.json({
            message: "Lỗi server: " + error.message
        }, { status: 500 })
    }
}

async function updateBookingStatus(data) {
    const { booking_id, status } = data

    if (!booking_id || !status) {
        return NextResponse.json(
            { success: false, error: 'booking_id và status là bắt buộc' },
            { status: 400 }
        )
    }

    try {
        await prisma.bookings.update({
            where: { booking_id: safeParseInt(booking_id) },
            data: {
                status: status,
                updated_at: new Date()
            }
        })

        return NextResponse.json({ success: true, message: 'Trạng thái đơn đặt xe đã được cập nhật.' })
    } catch (error) {
        console.error('updateBookingStatus Error:', error)
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        )
    }
}


async function getBookingDetail(id) {
    try {
        const booking = await prisma.bookings.findFirst({
            where: { booking_id: id },
            include: {
                vehicle: {
                    select: {
                        vehicle_id: true,
                        name: true,
                        base_price: true,
                        vehicle_type: true,
                        transmission: true,
                        seats: true,
                        location: true,
                        rating: true,
                        total_trips: true,
                        vehicle_images: true
                    }
                },
                renter: {
                    select: {
                        username: true,
                        phone_number: true,
                        account_id: true
                    }
                }
            }
        })
        if (!booking) {
            return NextResponse.json({
                message: 'Không tìm thấy đơn đặt xe.'
            }, { status: 404 })
        }
        const formattedBooking = formatBookingData(booking);
        console.log('Booking detail after formatBookingData:', formattedBooking);
        return NextResponse.json(formattedBooking)
    } catch (error) {
        console.error('getBookingDetail Error:', error)
        return NextResponse.json({
            message: "Lỗi server: " + error.message
        }, { status: 500 })
    }
}

function safeParseFloat(value) {
    if (value === null || typeof value === 'undefined' || value === '') {
        return null;
    }
    const parsed = parseFloat(value);
    return isNaN(parsed) ? null : parsed;
}

function safeParseInt(value) {
    if (value === null || typeof value === 'undefined' || value === '') {
        return null;
    }
    const parsed = parseInt(value);
    return isNaN(parsed) ? null : parsed;
}

function formatBookingData(booking) {
    const formatDatePart = (date) => {
        if (!date) return null;
        if (typeof date === 'string') return date;
        if (date instanceof Date) {
            return date.toISOString().slice(0, 10); // YYYY-MM-DD
        }
        return null;
    };

    const formatTimePart = (time) => {
        if (!time) return null;
        if (typeof time === 'string') return time;
        if (time instanceof Date) {
            return time.toISOString().slice(11, 16); // HH:MM
        }
        return null;
    };

    const formattedBooking = {
        id: safeParseInt(booking.booking_id),
        vehicle: {
            id: safeParseInt(booking.vehicle?.vehicle_id),
            name: booking.vehicle?.name,
            image: booking.vehicle?.vehicle_images[0]?.image_url || '/images/default-car.jpg',
            base_price: safeParseFloat(booking.vehicle?.base_price),
            vehicle_type: booking.vehicle?.vehicle_type,
            transmission: booking.vehicle?.transmission,
            seats: safeParseInt(booking.vehicle?.seats),
            location: booking.vehicle?.location
        },
        renter: {
            id: safeParseInt(booking.renter?.account_id),
            name: booking.renter?.username,
            phone: booking.renter?.phone_number
        },
        pickup_date: formatDatePart(booking.pickup_date),
        pickup_time: formatTimePart(booking.pickup_time),
        return_date: formatDatePart(booking.return_date),
        return_time: formatTimePart(booking.return_time),
        pickup_location: booking.pickup_location || null,
        return_location: booking.return_location || null,
        total_price: safeParseFloat(booking.total_price),
        discount_applied: safeParseFloat(booking.discount_applied),
        final_price: safeParseFloat(booking.final_price),
        status: booking.status,
        created_at: formatDatePart(booking.created_at),
        updated_at: formatDatePart(booking.updated_at)
    };

    console.log('Final image path in formatBookingData:', formattedBooking.vehicle.image);
    console.log('Inside formatBookingData, before return:', formattedBooking);

    return formattedBooking;
}

async function createBooking(data) {
    try {
        // Validate required fields
        const requiredFields = [
            'vehicle_id', 
            'start_date', 
            'end_date', 
            'pickup_location',
            'return_location',
            'total_price',
            'final_price'
        ];

        for (const field of requiredFields) {
            if (!data[field]) {
                throw new Error(`Missing required field: ${field}`);
            }
        }

        // Parse dates
        const pickup_date = new Date(data.start_date);
        const return_date = new Date(data.end_date);

        if (isNaN(pickup_date.getTime()) || isNaN(return_date.getTime())) {
            throw new Error('Invalid date format');
        }

        if (pickup_date >= return_date) {
            throw new Error('Return date must be after pickup date');
        }

        // Start transaction
        const result = await prisma.$transaction(async (tx) => {
            // Check if vehicle is available
            const vehicle = await tx.vehicles.findFirst({
                where: {
                    vehicle_id: safeParseInt(data.vehicle_id),
                    status: 'available'
                }
            });

            if (!vehicle) {
                throw new Error('Vehicle is not available');
            }

            // Get next booking ID
            const latestBooking = await tx.bookings.findFirst({
                orderBy: { booking_id: 'desc' }
            });
            const nextBookingId = (latestBooking?.booking_id || 0) + 1;

            // Create booking
            const booking = await tx.bookings.create({
                data: {
                    booking_id: nextBookingId,
                    vehicle_id: safeParseInt(data.vehicle_id),
                    renter_id: 18, // Default renter_id for now
                    pickup_date,
                    pickup_time: pickup_date,
                    return_date,
                    return_time: return_date,
                    total_price: safeParseFloat(data.total_price),
                    final_price: safeParseFloat(data.final_price),
                    status: 'confirmed',
                    pickup_location: data.pickup_location,
                    return_location: data.return_location,
                    created_at: new Date(),
                    updated_at: new Date()
                }
            });

            // Update vehicle status
            await tx.vehicles.update({
                where: { vehicle_id: safeParseInt(data.vehicle_id) },
                data: { 
                    status: 'rented',
                    current_booking_id: nextBookingId
                }
            });

            return booking;
        });

        const formattedBooking = formatBookingData(result);

        return NextResponse.json({
            success: true,
            message: 'Booking created successfully',
            booking: formattedBooking
        });

    } catch (error) {
        console.error('Booking creation error:', error);
        return NextResponse.json({
            success: false,
            error: error.message || 'Failed to create booking'
        }, { 
            status: error.message.includes('not available') ? 400 : 500 
        });
    }
}