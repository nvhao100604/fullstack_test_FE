// app/subscriptions/page.tsx
'use client';

import { useState, useEffect } from 'react';

interface Student {
  id: string;
  name: string;
}

interface Subscription {
  id: string;
  student_id: string;
  package_name: string;
  start_date: string;
  end_date: string;
  total_sessions: number;
  used_sessions: number;
  remaining_sessions: number;
  student?: Student;
}

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newSubscription, setNewSubscription] = useState({
    student_id: '',
    package_name: '',
    start_date: '',
    end_date: '',
    total_sessions: '',
  });
  const [message, setMessage] = useState<{ type: string; text: string } | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [subsRes, studentsRes] = await Promise.all([
      fetch('/api/subscriptions'),
      fetch('/api/students'),
    ]);
    setSubscriptions(await subsRes.json());
    setStudents(await studentsRes.json());
  };

  const handleCreateSubscription = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/subscriptions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newSubscription),
    });
    if (res.ok) {
      setMessage({ type: 'success', text: 'Subscription created successfully!' });
      setNewSubscription({ student_id: '', package_name: '', start_date: '', end_date: '', total_sessions: '' });
      setShowForm(false);
      fetchData();
      setTimeout(() => setMessage(null), 3000);
    } else {
      const error = await res.json();
      setMessage({ type: 'error', text: error.error });
    }
  };

  const handleMarkSession = async (subscriptionId: string) => {
    const res = await fetch(`/api/subscriptions/${subscriptionId}/mark-session`, {
      method: 'PATCH',
    });
    if (res.ok) {
      setMessage({ type: 'success', text: 'Session marked as used!' });
      fetchData();
      setTimeout(() => setMessage(null), 3000);
    } else {
      const error = await res.json();
      setMessage({ type: 'error', text: error.error });
    }
  };

  const isActive = (endDate: string) => {
    return endDate >= new Date().toISOString().split('T')[0];
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Subscriptions</h1>
      
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
          Create Subscription
        </button>
      </div>
      
      {showForm && (
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">New Subscription</h2>
          <form onSubmit={handleCreateSubscription} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Student</label>
                <select required value={newSubscription.student_id} onChange={(e) => setNewSubscription({ ...newSubscription, student_id: e.target.value })} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                  <option value="">Select Student</option>
                  {students.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Package Name</label>
                <input type="text" required value={newSubscription.package_name} onChange={(e) => setNewSubscription({ ...newSubscription, package_name: e.target.value })} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Start Date</label>
                <input type="date" required value={newSubscription.start_date} onChange={(e) => setNewSubscription({ ...newSubscription, start_date: e.target.value })} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">End Date</label>
                <input type="date" required value={newSubscription.end_date} onChange={(e) => setNewSubscription({ ...newSubscription, end_date: e.target.value })} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Total Sessions</label>
                <input type="number" required value={newSubscription.total_sessions} onChange={(e) => setNewSubscription({ ...newSubscription, total_sessions: e.target.value })} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
              </div>
            </div>
            <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">Create Subscription</button>
          </form>
        </div>
      )}
      
      <div className="grid grid-cols-1 gap-6">
        {subscriptions.map(sub => (
          <div key={sub.id} className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">{sub.package_name}</h3>
                <p className="text-gray-600">Student: {sub.student?.name || 'N/A'}</p>
                <p className="text-sm text-gray-500">Period: {sub.start_date} to {sub.end_date}</p>
                <div className="mt-2">
                  <div className="flex items-center space-x-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${isActive(sub.end_date) ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {isActive(sub.end_date) ? 'Active' : 'Expired'}
                    </span>
                    <span className="text-sm">Used: {sub.used_sessions} / {sub.total_sessions}</span>
                    <span className="text-sm font-medium">Remaining: {sub.total_sessions - sub.used_sessions}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${(sub.used_sessions / sub.total_sessions) * 100}%` }}></div>
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleMarkSession(sub.id)}
                disabled={sub.used_sessions >= sub.total_sessions || !isActive(sub.end_date)}
                className={`px-3 py-1 rounded-md text-sm ${sub.used_sessions >= sub.total_sessions || !isActive(sub.end_date) ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
              >
                Mark Session Used
              </button>
            </div>
          </div>
        ))}
        {subscriptions.length === 0 && (
          <div className="text-center py-8 text-gray-500">No subscriptions yet.</div>
        )}
      </div>
    </div>
  );
}