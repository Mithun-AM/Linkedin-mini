import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import User from '../../../../../models/User';
import connectToDB from '../../../../../lib/db';

export async function POST(request: Request) {
  try {
    await connectToDB();
    const { name, email, password, bio } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: 'Email is already registered' }, { status: 409 }); // 409 Conflict is more appropriate
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      bio,
    });

    // We don't want to send the password back, even if it's hashed
    const userResponse = {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      bio: newUser.bio,
    };

    return NextResponse.json(
      { message: 'User registered successfully', user: userResponse },
      { status: 201 }
    );
  } catch (err) {
    console.error('Register Error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}