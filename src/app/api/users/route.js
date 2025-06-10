import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

let prisma;
if (process.env.NODE_ENV === 'production') {
    prisma = new PrismaClient();
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
        });
    }
    prisma = global.prisma;
}

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const filter = searchParams.get('filter'); // 'total', 'month', 'week'

        let whereClause = {};
        const now = new Date();

        switch (filter) {
            case 'month':
                const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
                startOfMonth.setHours(0, 0, 0, 0);
                whereClause.created_at = {
                    gte: startOfMonth
                };
                break;
            case 'week':
                const startOfWeek = new Date(now);
                startOfWeek.setDate(now.getDate() - now.getDay()); // Start of current week (Sunday)
                startOfWeek.setHours(0, 0, 0, 0);
                whereClause.created_at = {
                    gte: startOfWeek
                };
                break;
            case 'total':
            default:
                // No specific date filter for total users
                break;
        }

        // Exclude users with role_id 3 and account_id 18
        const excludedAccountIds = [];
        const rolesToExclude = [3]; // Exclude only role 3

        // Find account_ids that have roles 3
        const accountsWithExcludedRoles = await prisma.account_roles.findMany({
            where: {
                role_id: {
                    in: rolesToExclude
                }
            },
            select: {
                account_id: true
            }
        });

        accountsWithExcludedRoles.forEach(ar => excludedAccountIds.push(ar.account_id));

        // Add account_id 18 to the excluded list if not already there
        if (!excludedAccountIds.includes(18)) {
            excludedAccountIds.push(18);
        }

        if (excludedAccountIds.length > 0) {
            whereClause.account_id = {
                notIn: excludedAccountIds
            };
        }

        const users = await prisma.accounts.findMany({
            where: whereClause,
            select: {
                account_id: true,
                username: true,
                phone_number: true,
            },
            orderBy: {
                created_at: 'desc'
            }
        });

        return NextResponse.json({
            success: true,
            users
        });

    } catch (error) {
        console.error('Error in users API:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
} 