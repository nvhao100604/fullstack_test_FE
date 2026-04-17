// app/api/class-registrations/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { 
  classRegistrations, 
  subscriptions, 
  getStudentById, 
  getClassById, 
  getRegistrationsByStudentId, 
  getRegistrationsByClassId,
  generateId,
  ClassRegistration
} from '@/lib/store';

// Helper: Check schedule conflict
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function hasScheduleConflict(studentId: string, newClass: any): boolean {
  const registrations = getRegistrationsByStudentId(studentId);
  for (const reg of registrations) {
    const registeredClass = getClassById(reg.class_id);
    if (registeredClass && 
        registeredClass.day_of_week === newClass.day_of_week && 
        registeredClass.start_time === newClass.start_time) {
      return true;
    }
  }
  return false;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { student_id, class_id } = body;
    
    if (!student_id || !class_id) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    const student = getStudentById(student_id);
    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }
    
    const classObj = getClassById(class_id);
    if (!classObj) {
      return NextResponse.json({ error: 'Class not found' }, { status: 404 });
    }
    
    // Check subscription validity
    const subscription = subscriptions.find(s => s.student_id === student_id);
    if (!subscription) {
      return NextResponse.json({ error: 'No subscription found for student' }, { status: 400 });
    }
    
    const today = new Date().toISOString().split('T')[0];
    if (subscription.end_date < today) {
      return NextResponse.json({ error: 'Subscription has expired' }, { status: 400 });
    }
    
    if (subscription.used_sessions >= subscription.total_sessions) {
      return NextResponse.json({ error: 'No remaining sessions in subscription' }, { status: 400 });
    }
    
    // Check schedule conflict
    if (hasScheduleConflict(student_id, classObj)) {
      return NextResponse.json({ error: 'Schedule conflict: student already has a class at this time' }, { status: 400 });
    }
    
    // Check class capacity
    const currentRegistrations = getRegistrationsByClassId(class_id);
    if (currentRegistrations.length >= classObj.max_students) {
      return NextResponse.json({ error: 'Class is full' }, { status: 400 });
    }
    
    // Check if already registered
    const alreadyRegistered = classRegistrations.some(r => r.student_id === student_id && r.class_id === class_id);
    if (alreadyRegistered) {
      return NextResponse.json({ error: 'Student already registered for this class' }, { status: 400 });
    }
    
    // Create registration
    const newRegistration: ClassRegistration = {
      id: generateId(),
      class_id,
      student_id,
      registered_at: new Date().toISOString(),
    };
    
    classRegistrations.push(newRegistration);
    
    // Increment used_sessions
    subscription.used_sessions += 1;
    
    return NextResponse.json(newRegistration, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  // Return registrations with class details
  const registrationsWithDetails = classRegistrations.map(reg => {
    const classObj = getClassById(reg.class_id);
    const student = getStudentById(reg.student_id);
    return {
      ...reg,
      class: classObj,
      student: student,
    };
  });
  return NextResponse.json(registrationsWithDetails);
}