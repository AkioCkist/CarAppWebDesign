import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

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
    const { data: existingUser } = await supabase.from('accounts').select('account_id').eq('phone_number', phone).single();
    if (existingUser) {
      return NextResponse.json({ error: 'Phone number already exists' }, { status: 409 });
    }

    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 12);
    const { data: newUser, error: userError } = await supabase
      .from('accounts')
      .insert({ username: name, phone_number: phone, password: hashedPassword, created_at: new Date().toISOString() })
      .select('account_id, username, phone_number')
      .single();

    if (userError) throw userError;

    // Assign default role
    await supabase.from('account_roles').insert({ account_id: newUser.account_id, role_id: 2 });

    return NextResponse.json({
      success: true,
      message: 'Account created successfully!',
      user: newUser
    });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Registration failed. Please try again.' }, { status: 500 });
  }
}