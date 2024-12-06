import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Settings from '@/models/Settings';

export async function GET() {
  await dbConnect();

  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({
        websiteTitle: 'Default Title',
        description: 'Default Description',
        logo: '/assets/images/logo.png',
        email: 'contact@example.com',
        phone: '+1234567890',
        address: 'Default Address',
        socialLinks: {
          facebook: '',
          twitter: '',
          instagram: '',
          linkedin: '',
        },
      });
    }
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  await dbConnect();

  try {
    const body = await request.json();
    const settings = await Settings.findOne();

    if (!settings) {
      const newSettings = await Settings.create(body);
      return NextResponse.json(newSettings);
    }

    const updatedSettings = await Settings.findOneAndUpdate(
      {},
      body,
      { new: true, runValidators: true }
    );

    return NextResponse.json(updatedSettings);
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    );
  }
} 