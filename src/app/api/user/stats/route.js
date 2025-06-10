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

export async function GET() {
    try {
        // Get current date and calculate start dates
        const now = new Date();
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay()); // Start of current week (Sunday)
        startOfWeek.setHours(0, 0, 0, 0);

        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        startOfMonth.setHours(0, 0, 0, 0);

        // Define excluded roles and account_id
        const rolesToExclude = [3]; // Exclude only role 3
        const specificAccountIdToExclude = 18; // Exclude account_id 18

        // Find account_ids that have excluded roles
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

        let excludedAccountIds = accountsWithExcludedRoles.map(ar => ar.account_id);
        
        // Add specific account_id 18 to the excluded list if not already there
        if (!excludedAccountIds.includes(specificAccountIdToExclude)) {
            excludedAccountIds.push(specificAccountIdToExclude);
        }

        // Construct the where clause for accounts, excluding the identified accounts
        const accountWhereClause = {
            account_id: {
                notIn: excludedAccountIds
            }
        };

        // Get total users count (excluding specified roles and ID)
        const totalUsers = await prisma.accounts.count({
            where: accountWhereClause
        });

        // Get new users this month (excluding specified roles and ID)
        const newUsersThisMonth = await prisma.accounts.count({
            where: {
                ...accountWhereClause,
                created_at: {
                    gte: startOfMonth
                }
            }
        });

        // Get new users this week (excluding specified roles and ID)
        const newUsersThisWeek = await prisma.accounts.count({
            where: {
                ...accountWhereClause,
                created_at: {
                    gte: startOfWeek
                }
            }
        });

        return NextResponse.json({
            success: true,
            totalUsers,
            newUsersThisMonth,
            newUsersThisWeek
        });

    } catch (error) {
        console.error('Error in user stats API:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
} 