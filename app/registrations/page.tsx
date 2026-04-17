// app/registrations/page.tsx
'use client';

import { useState, useEffect } from 'react';

interface Student {
  id: string;
  name: string;
}

interface Class {
  id: string;
  name: string;
  subject: string;
  day_of_week: string;
  time_slot: string;
}

interface Registration {
  id: string;
  class_id: string;
  student_id: string;
  registered_at: string;
  class: Class;
  student: Student;
}

export default function RegistrationsPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newRegistration, setNewRegistration] = useState({ student_id: '', class_id: '' });
  const [message, setMessage] = useState<{ type: string; text: string } | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [regsRes, studentsRes, classesRes] = await Promise.all([
      fetch('/api/class-registrations'),
      fetch('/api/students'),
      fetch('/api/classes'),
    ]);
    setRegistrations(await regsRes.json());
    setStudents(await studentsRes.json());
    setClasses(await classesRes.json());
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/class-registrations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newRegistration),
    });
    if (res.ok) {
      setMessage({ type: 'success', text: 'Student registered successfully!' });
      setNewRegistration({ student_id: '', class_id: '' });
      setShowForm(false);
      fetchData();
      setTimeout(() => setMessage(null), 3000);
    } else {
      const error = await res.json();
      setMessage({ type: 'error', text: error.error });
    }
  };

  const handleCancel = async (registrationId: string) => {
    if (confirm('Cancel this registration? Check cancellation policy (refund if >24h before class).')) {
      const res = await fetch(`/api/class-registrations/${registrationId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        const result = await res.json();
        setMessage({ type: 'success', text: result.message });
        fetchData();
        setTimeout(() => setMessage(null), 3000);
      } else {
        const error = await res.json();
        setMessage({ type: 'error', text: error.error });
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Class Registrations</h1>
      
      {message && (
        <div className={`mb-4 p-4 rounded-md ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message.text}
        </div>
      )}
      
      <div className="mb-6">
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          Register Student for Class
        </button>
      </div>
      
      {showForm && (
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">New Registration</h2>
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Student</label>
              <select required value={newRegistration.student_id} onChange={(e) => setNewRegistration({ ...newRegistration, student_id: e.target.value })} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                <option value="">Select Student</option>
                {students.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Class</label>
              <select required value={newRegistration.class_id} onChange={(e) => setNewRegistration({ ...newRegistration, class_id: e.target.value })} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                <option value="">Select Class</option>
                {classes.map(c => (
                  <option key={c.id} value={c.id}>{c.name} - {c.day_of_week} {c.time_slot}</option>
                ))}
              </select>
            </div>
            <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">Register</button>
          </form>
        </div>
      )}
      
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Schedule</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registered On</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {registrations.map(reg => (
              <tr key={reg.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{reg.student?.name || 'N/A'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{reg.class?.name || 'N/A'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{reg.class?.subject || 'N/A'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{reg.class?.day_of_week} {reg.class?.time_slot}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(reg.registered_at).toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button onClick={() => handleCancel(reg.id)} className="text-red-600 hover:text-red-800">Cancel</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {registrations.length === 0 && (
          <div className="text-center py-8 text-gray-500">No registrations yet.</div>
        )}
      </div>
      
      <div className="mt-4 p-4 bg-yellow-50 rounded-md">
        <p className="text-sm text-yellow-800">
          <strong>Cancellation Policy:</strong> If cancelled more than 24 hours before class start time, the session will be refunded (used_sessions decreases by 1).
          If cancelled less than 24 hours before, no refund.
        </p>
      </div>
    </div>
  );
}