// route.js
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function PUT(request) {
  console.log('Profile update API called');
  
  // Add CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'PUT, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  try {
    const body = await request.json();
    console.log('Request body:', body);
    const { account_id, username, phone_number, new_password } = body;

    if (!account_id) {
      console.log('Missing account_id');
      return NextResponse.json(
        { error: 'Account ID is required' },
        { status: 400, headers }
      );
    }

    console.log('Checking user exists for account_id:', account_id);
    // Check if user exists
    const { data: existingUser, error: userError } = await supabase
      .from('accounts')
      .select('account_id, username, phone_number')
      .eq('account_id', account_id)
      .single();

    if (userError || !existingUser) {
      console.log('User not found:', userError);
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404, headers }
      );
    }

    // Validate username
    if (username && username.trim() === '') {
      return NextResponse.json(
        { error: 'Username cannot be empty' },
        { status: 400 }
      );
    }

    // Validate phone number
    if (phone_number && !/^\+?\d{10,15}$/.test(phone_number)) {
      return NextResponse.json(
        { error: 'Please enter a valid phone number' },
        { status: 400 }
      );
    }

    // Check if phone number is already taken by another user
    if (phone_number && phone_number !== existingUser.phone_number) {
      const { data: phoneCheck } = await supabase
        .from('accounts')
        .select('account_id')
        .eq('phone_number', phone_number)
        .neq('account_id', account_id)
        .single();

      if (phoneCheck) {
        return NextResponse.json(
          { error: 'Phone number is already taken' },
          { status: 409 }
        );
      }
    }

    // Prepare update data
    const updateData = {};
    
    if (username) {
      updateData.username = username.trim();
    }
    
    if (phone_number) {
      updateData.phone_number = phone_number;
    }

    // Hash new password if provided
    if (new_password) {
      if (new_password.length < 6) {
        return NextResponse.json(
          { error: 'Password must be at least 6 characters' },
          { status: 400 }
        );
      }
      updateData.password = await bcrypt.hash(new_password, 12);
    }

    // Update user in database
    const { data: updatedUser, error: updateError } = await supabase
      .from('accounts')
      .update(updateData)
      .eq('account_id', account_id)
      .select('account_id, username, phone_number, created_at')
      .single();

    if (updateError) {
      console.error('Profile update error:', updateError);
      return NextResponse.json(
        { error: 'Failed to update profile' },
        { status: 500 }
      );
    }    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: updatedUser.account_id,
        name: updatedUser.username,
        phone: updatedUser.phone_number
      }
    }, { headers });

  } catch (error) {
    console.error('Profile update API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers }
    );
  }
}

export async function OPTIONS(request) {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'PUT, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

export async function GET() {
  return NextResponse.json({
    message: 'Profile API is working',
    methods: ['PUT']
  });
}