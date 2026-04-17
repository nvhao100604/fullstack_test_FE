// app/api/subscriptions/[id]/mark-session/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { subscriptions, getStudentById } from '@/lib/store';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const subscriptionId = params.id;
  const subscription = subscriptions.find(s => s.id === subscriptionId);
  
  if (!subscription) {
    return NextResponse.json({ error: 'Subscription not found' }, { status: 404 });
  }
  
  if (subscription.used_sessions >= subscription.total_sessions) {
    return NextResponse.json({ error: 'All sessions already used' }, { status: 400 });
  }
  
  subscription.used_sessions += 1;
  
  return NextResponse.json({
    ...subscription,
    remaining_sessions: subscription.total_sessions - subscription.used_sessions,
  });
}