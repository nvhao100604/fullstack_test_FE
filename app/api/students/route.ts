// app/api/students/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { students, generateId, Student, getParentById } from '@/lib/store';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, dob, gender, current_grade, parent_id } = body;
    
    if (!name || !dob || !gender || !current_grade || !parent_id) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    // Check if parent exists
    const parent = getParentById(parent_id);
    if (!parent) {
      return NextResponse.json({ error: 'Parent not found' }, { status: 404 });
    }
    
    const newStudent: Student = {
      id: generateId(),
      name,
      dob,
      gender,
      current_grade,
      parent_id,
    };
    
    students.push(newStudent);
    return NextResponse.json(newStudent, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json(students);
}