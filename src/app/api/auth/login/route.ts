// src/app/api/auth/login/route.ts
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../../../../../models/User';
import connectToDB from '../../../../../lib/db';

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(request: Request) {
  try {
    await connectToDB();
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // Explicitly select the password field since it's excluded by default
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });

    // Create a user object to return, excluding the password
    const userResponse = {
        id: user._id,
        name: user.name,
        email: user.email,
        bio: user.bio,
    };

    return NextResponse.json({
      message: 'Login successful',
      token,
      user: userResponse,
    });
  } catch (err) {
    console.error('Login Error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}