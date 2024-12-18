import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  await dbConnect();

  try {
    const body = await request.json();
    const { name, email, password, role, status } = body;

    console.log('Received user data:', { name, email, role, status });

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user document
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: role || 'user',
      status: status || 'active'
    });

    console.log('About to save user:', newUser.toObject());

    // Save the user
    const savedUser = await newUser.save();
    
    console.log('Saved user:', savedUser.toObject());

    // Remove password from response
    const userResponse = {
      _id: savedUser._id,
      name: savedUser.name,
      email: savedUser.email,
      role: savedUser.role,
      status: savedUser.status,
      createdAt: savedUser.createdAt,
      updatedAt: savedUser.updatedAt,
    };

    return NextResponse.json(userResponse, { status: 201 });
  } catch (error: unknown) {
    console.error('Error creating user:', error);
    
    
  
    return NextResponse.json(
      { error: 'Failed to create user', details: (error as Error).message },
      { status: 500 }
    );
  }
} 