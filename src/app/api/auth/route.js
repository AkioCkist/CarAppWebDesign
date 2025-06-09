import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {
  try {
    const body = await request.json();
    const { action, phone, password, name } = body;

    if (action === 'register') {
      return await handleRegister(phone, password, name);
    } else if (action === 'login') {
      return await handleLogin(phone, password);
    } else if (action === 'logout') {
      return await handleLogout();
    } else {
      return NextResponse.json(
        { error: 'Invalid action' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Auth API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function handleRegister(phone, password, name) {
  try {
    if (!phone || !password || !name) {
      return NextResponse.json(
        { error: 'Phone, password, and name are required' },
        { status: 400 }
      );
    }

    if (!/^\+?\d{10,15}$/.test(phone)) {
      return NextResponse.json(
        { error: 'Please enter a valid phone number' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    const { data: existingUser } = await supabase
      .from('accounts')
      .select('account_id')
      .eq('phone_number', phone)
      .single();

    if (existingUser) {
      return NextResponse.json(
        { error: 'Phone number already exists' },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const { data: newUser, error: userError } = await supabase
      .from('accounts')
      .insert({
        username: name,
        phone_number: phone,
        password: hashedPassword,
        created_at: new Date().toISOString()
      })
      .select('account_id, username, phone_number, created_at')
      .single();

    if (userError) {
      console.error('User creation error:', userError);
      return NextResponse.json(
        { error: 'Failed to create account' },
        { status: 500 }
      );
    }

    await supabase
    .from('account_roles')
    .insert({
      account_id: newUser.account_id,
      role_id: 2
    });


    return NextResponse.json({
      success: true,
      message: 'Account created successfully',
      user: {
        id: newUser.account_id,
        name: newUser.username,
        phone: newUser.phone_number
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Registration failed. Please try again.' },
      { status: 500 }
    );
  }
}

async function handleLogin(phone, password) {
  try {
    if (!phone || !password) {
      return NextResponse.json(
        { error: 'Phone and password are required' },
        { status: 400 }
      );
    }

    const { data: user, error: userError } = await supabase
      .from('accounts')
      .select(`
        account_id,
        username,
        phone_number,
        password,
        created_at,
        account_roles (
          role_id,
          role:roles (
            role_id,
            role_name
          )
        )
      `)
      .eq('phone_number', phone)
      .single();

    if (userError || !user) {
      return NextResponse.json(
        { error: 'Phone number or password is incorrect' },
        { status: 401 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Phone number or password is incorrect' },
        { status: 401 }
      );
    }

    const userData = {
      id: user.account_id,
      name: user.username,
      phone: user.phone_number,
      roles: user.account_roles.map(ar => ({
        id: ar.role.role_id,
        name: ar.role.role_name
      }))
    };

    console.log('User data being set in session:', userData);

    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
      user: userData
    });

    const sessionToken = btoa(JSON.stringify(userData));
    response.cookies.set('session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
      sameSite: 'lax',
    });

    return response;

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Login failed. Please try again.' },
      { status: 500 }
    );
  }
}

async function handleLogout() {
  const response = NextResponse.json({
    success: true,
    message: 'Logout successful'
  });

  response.cookies.set('session', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 0,
    path: '/',
    sameSite: 'lax',
  });

  return response;
}

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('accounts')
      .select('account_id')
      .limit(1);

    if (error) {
      console.error('Database connection error:', error);
      return NextResponse.json({
        error: error.message,
        code: error.code
      }, { status: 500 });
    }

    const { count, error: countError } = await supabase
      .from('accounts')
      .select('*', { count: 'exact', head: true });

    return NextResponse.json({
      message: 'Auth API is working',
      dbConnection: 'OK',
      recordsFound: data?.length || 0,
      totalRecords: count || 0
    });

  } catch (error) {
    console.error('API test error:', error);
    return NextResponse.json({
      message: 'Auth API is working',
      dbConnection: 'Failed',
      error: error.message
    }, { status: 500 });
  }
}
