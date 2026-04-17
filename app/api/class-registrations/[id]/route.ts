// app/api/class-registrations/[id]/route.ts
import { 
  classRegistrations, 
  subscriptions, 
  getClassById, 
  getStudentById,
  Class
} from '@/lib/store';

// Helper: Get next occurrence of a class day/time
function getNextClassDateTime(classObj: Class): Date {
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const targetDayIndex = daysOfWeek.indexOf(classObj.day_of_week);
  const now = new Date();
  const currentDayIndex = now.getDay();
  
  let daysUntil = targetDayIndex - currentDayIndex;
  if (daysUntil <= 0) {
    daysUntil += 7;
  }
  
  const [hours, minutes] = classObj.start_time.split(':').map(Number);
  const nextDate = new Date(now);
  nextDate.setDate(now.getDate() + daysUntil);
  nextDate.setHours(hours, minutes, 0, 0);
  
  return nextDate;
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const registrationId = params.id;
  const registrationIndex = classRegistrations.findIndex(r => r.id === registrationId);
  
  if (registrationIndex === -1) {
    return NextResponse.json({ error: 'Registration not found' }, { status: 404 });
  }
  
  const registration = classRegistrations[registrationIndex];
  const classObj = getClassById(registration.class_id);
  const student = getStudentById(registration.student_id);
  
  if (!classObj || !student) {
    return NextResponse.json({ error: 'Associated class or student not found' }, { status: 404 });
  }
  
  // Find subscription
  const subscription = subscriptions.find(s => s.student_id === student.id);
  
  // Check cancellation time condition
  const nextClassTime = getNextClassDateTime(classObj);
  const now = new Date();
  const hoursUntilClass = (nextClassTime.getTime() - now.getTime()) / (1000 * 60 * 60);
  
  // Remove registration
  classRegistrations.splice(registrationIndex, 1);
  
  // Refund session if cancelled more than 24 hours before class
  if (hoursUntilClass > 24 && subscription) {
    subscription.used_sessions = Math.max(0, subscription.used_sessions - 1);
    return NextResponse.json({ 
      message: 'Registration cancelled. Session refunded.', 
      refunded: true 
    });
  }
  
  return NextResponse.json({ 
    message: 'Registration cancelled. No session refunded (less than 24 hours before class).', 
    refunded: false 
  });
}