// \src\app\api\auth\me\route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectToDB from '../../../../../lib/db';
import User from '../../../../../models/User';
import jwt from 'jsonwebtoken';
interface DecodedToken {
  id: string;
}
export async function GET(req: NextRequest) {
  try {
    await connectToDB();

    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized: Missing or invalid token' }, { status: 401 });
    }
    const token = authHeader.split(' ')[1];

    let decoded: DecodedToken;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
    } catch{
      return NextResponse.json({ error: 'Unauthorized: Invalid token' }, { status: 401 });
    }

    const authorId = decoded.id;
    const user = await User.findById(authorId); // Password is not selected by default
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userResponse = {
      id: user._id.toString(), // Convert ObjectId to string
      name: user.name,
      email: user.email,
      bio: user.bio,
    };

    return NextResponse.json({ user: userResponse });
  } catch (error) {
    console.error('Error fetching current user:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}