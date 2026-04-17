// app/api/classes/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { classes, generateId, Class } from '@/lib/store';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, subject, day_of_week, time_slot, start_time, teacher_name, max_students } = body;
    
    if (!name || !subject || !day_of_week || !time_slot || !start_time || !teacher_name || !max_students) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    const newClass: Class = {
      id: generateId(),
      name,
      subject,
      day_of_week,
      time_slot,
      start_time,
      teacher_name,
      max_students: parseInt(max_students),
    };
    
    classes.push(newClass);
    return NextResponse.json(newClass, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const day = searchParams.get('day');
  
  let filteredClasses = [...classes];
  if (day) {
    filteredClasses = filteredClasses.filter(c => c.day_of_week === day);
  }
  
  return NextResponse.json(filteredClasses);
}