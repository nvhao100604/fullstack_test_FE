// app/api/students/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { students, getParentById, getStudentById } from '@/lib/store';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const student = getStudentById(params.id);
  
  if (!student) {
    return NextResponse.json({ error: 'Student not found' }, { status: 404 });
  }
  
  const parent = getParentById(student.parent_id);
  
  return NextResponse.json({
    ...student,
    parent: parent || null,
  });
}