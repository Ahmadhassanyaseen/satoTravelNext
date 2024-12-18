import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import PaymentMethod from '@/models/PaymentMethod';

export async function GET() {
  try {
    await connectDB();
    const cards = await PaymentMethod.find();
    return NextResponse.json(cards);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { cardHolder, cardNumber, expiryDate } = await req.json();
    
    await connectDB();
    
    // Only store last 4 digits of card number
    const lastFourDigits = cardNumber.slice(-4);
    
    const card = await PaymentMethod.create({
      cardHolder,
      cardNumber: lastFourDigits,
      expiryDate,
      isDefault: false
    });
    
    return NextResponse.json(card);
  } catch (error: unknown) {
    console.error('Error:', error);
    if (error instanceof Error && error.name === 'ValidationError') {
      // Type assertion since we know it's a ValidationError
      const validationError = (error as unknown) as { errors: Record<string, unknown> };
      return NextResponse.json({ error: 'Validation Error', details: validationError.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// Add DELETE endpoint
export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    const cardId = url.pathname.split('/').pop();
    
    await connectDB();
    await PaymentMethod.findByIdAndDelete(cardId);
    
    return NextResponse.json({ message: 'Card deleted successfully' });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 