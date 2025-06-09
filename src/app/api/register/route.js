import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

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

export async function POST(request) {
  try {
    const body = await request.json();
    const { phone, password, name } = body;

    // Input validation
    if (!phone || !password || !name) {
      return NextResponse.json({ error: 'Phone, password, and name are required' }, { status: 400 });
    }
    if (!/^\+?\d{10,15}$/.test(phone)) {
      return NextResponse.json({ error: 'Please enter a valid phone number' }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    // Check for existing user
    const existingUser = await prisma.accounts.findUnique({
      where: { phone_number: phone }
    });

    if (existingUser) {
      return NextResponse.json({ error: 'Phone number already exists' }, { status: 409 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user with transaction to ensure both user and role are created
    const result = await prisma.$transaction(async (tx) => {
  // Step 1: Create the user
  const newUser = await tx.accounts.create({
    data: {
      username: name,
      phone_number: phone,
      password: hashedPassword,
    },
    select: {
      account_id: true,
      username: true,
      phone_number: true,
      created_at: true
    }
  });

  // Step 2: Check if role already exists
  const existingRole = await tx.account_roles.findUnique({
    where: {
      account_id_role_id: {
        account_id: newUser.account_id,
        role_id: 1
      }
    }
  });

  // Step 3: Assign default role if not already assigned
  if (!existingRole) {
    await tx.account_roles.create({
      data: {
        account_id: newUser.account_id,
        role_id: 1
      }
    });
  }

  return newUser;
});


    return NextResponse.json({
      success: true,
      message: 'Account created successfully!',
      user: {
        id: result.account_id,
        name: result.username,
        phone: result.phone_number,
        created_at: result.created_at
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle Prisma specific errors
    if (error.code === 'P2002') {
      const target = error.meta?.target;
      if (target?.includes('phone_number')) {
        return NextResponse.json({ error: 'Phone number already exists' }, { status: 409 });
      }
      if (target?.includes('username')) {
        return NextResponse.json({ error: 'Username already exists' }, { status: 409 });
      }
      return NextResponse.json({ error: 'Account with this information already exists' }, { status: 409 });
    }
    
    return NextResponse.json({ error: 'Registration failed. Please try again.' }, { status: 500 });
  } finally {
    // Disconnect prisma in production to prevent connection leaks
    if (process.env.NODE_ENV === 'production') {
      await prisma.$disconnect();
    }
  }
}