// app/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface DashboardStats {
  totalParents: number;
  totalStudents: number;
  totalClasses: number;
  totalRegistrations: number;
  activeSubscriptions: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalParents: 0,
    totalStudents: 0,
    totalClasses: 0,
    totalRegistrations: 0,
    activeSubscriptions: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      const [parentsRes, studentsRes, classesRes, registrationsRes, subscriptionsRes] = await Promise.all([
        fetch('/api/parents'),
        fetch('/api/students'),
        fetch('/api/classes'),
        fetch('/api/class-registrations'),
        fetch('/api/subscriptions'),
      ]);
      
      const parents = await parentsRes.json();
      const students = await studentsRes.json();
      const classes = await classesRes.json();
      const registrations = await registrationsRes.json();
      const subscriptions = await subscriptionsRes.json();
      
      setStats({
        totalParents: parents.length,
        totalStudents: students.length,
        totalClasses: classes.length,
        totalRegistrations: registrations.length,
        activeSubscriptions: subscriptions.length,
      });
    };
    
    fetchStats();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Total Parents</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.totalParents}</dd>
          </div>
        </div>
        
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Total Students</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.totalStudents}</dd>
          </div>
        </div>
        
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Total Classes</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.totalClasses}</dd>
          </div>
        </div>
        
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Registrations</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.totalRegistrations}</dd>
          </div>
        </div>
        
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Subscriptions</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.activeSubscriptions}</dd>
          </div>
        </div>
      </div>
      
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link href="/parents-students" className="block w-full text-center bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
              Add Parent & Student
            </Link>
            <Link href="/classes" className="block w-full text-center bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
              Create Class
            </Link>
            <Link href="/registrations" className="block w-full text-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
              Register for Class
            </Link>
            <Link href="/subscriptions" className="block w-full text-center bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700">
              Create Subscription
            </Link>
          </div>
        </div>
        
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">System Overview</h2>
          <p className="text-gray-600">
            This system manages students, parents, class schedules, and subscription packages.
            Each student must have a valid subscription with remaining sessions to register for classes.
            Cancellations made more than 24 hours before class start time will refund a session.
          </p>
        </div>
      </div>
    </div>
  );
}