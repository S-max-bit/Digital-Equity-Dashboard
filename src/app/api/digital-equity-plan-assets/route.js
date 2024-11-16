import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const assets = await db.digitalEquityAsset.findMany();
    return NextResponse.json(assets);
  } catch (error) {
    console.error('Error fetching assets:', error);
    return NextResponse.json(
      { error: 'Failed to fetch digital equity plan assets' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const asset = await db.digitalEquityAsset.create({
      data: {
        ...data
      }
    });
    return NextResponse.json(asset, { status: 201 });
  } catch (error) {
    console.error('Error creating asset:', error);
    return NextResponse.json(
      { error: 'Failed to create digital equity plan asset' },
      { status: 500 }
    );
  }
}
