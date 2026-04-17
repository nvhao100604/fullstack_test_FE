// app/api/parents/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { parents, generateId, Parent } from '@/lib/store';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phone, email } = body;
    
    if (!name || !phone || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    const newParent: Parent = {
      id: generateId(),
      name,
      phone,
      email,
    };
    
    parents.push(newParent);
    return NextResponse.json(newParent, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json(parents);
}