// app/api/subscriptions/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { subscriptions, getStudentById, generateId, Subscription } from '@/lib/store';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { student_id, package_name, start_date, end_date, total_sessions } = body;
    
    if (!student_id || !package_name || !start_date || !end_date || !total_sessions) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    const student = getStudentById(student_id);
    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }
    
    const newSubscription: Subscription = {
      id: generateId(),
      student_id,
      package_name,
      start_date,
      end_date,
      total_sessions: parseInt(total_sessions),
      used_sessions: 0,
    };
    
    subscriptions.push(newSubscription);
    return NextResponse.json(newSubscription, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  // Return subscriptions with student info
  const subscriptionsWithStudent = subscriptions.map(sub => {
    const student = getStudentById(sub.student_id);
    return {
      ...sub,
      student,
      remaining_sessions: sub.total_sessions - sub.used_sessions,
    };
  });
  return NextResponse.json(subscriptionsWithStudent);
}