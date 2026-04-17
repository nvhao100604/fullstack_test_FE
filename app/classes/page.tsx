// app/classes/page.tsx
'use client';

import { useState, useEffect } from 'react';

interface Class {
  id: string;
  name: string;
  subject: string;
  day_of_week: string;
  time_slot: string;
  start_time: string;
  teacher_name: string;
  max_students: number;
}

export default function ClassesPage() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [filteredClasses, setFilteredClasses] = useState<Class[]>([]);
  const [selectedDay, setSelectedDay] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [newClass, setNewClass] = useState({
    name: '',
    subject: '',
    day_of_week: '',
    time_slot: '',
    start_time: '',
    teacher_name: '',
    max_students: '',
  });
  const [message, setMessage] = useState<{ type: string; text: string } | null>(null);

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    if (selectedDay) {
      setFilteredClasses(classes.filter(c => c.day_of_week === selectedDay));
    } else {
      setFilteredClasses(classes);
    }
  }, [selectedDay, classes]);

  const fetchClasses = async () => {
    const res = await fetch('/api/classes');
    const data = await res.json();
    setClasses(data);
  };

  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/classes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newClass),
    });
    if (res.ok) {
      setMessage({ type: 'success', text: 'Class created successfully!' });
      setNewClass({ name: '', subject: '', day_of_week: '', time_slot: '', start_time: '', teacher_name: '', max_students: '' });
      setShowForm(false);
      fetchClasses();
      setTimeout(() => setMessage(null), 3000);
    } else {
      const error = await res.json();
      setMessage({ type: 'error', text: error.error });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Classes</h1>
      
      {message && (
        <div className={`mb-4 p-4 rounded-md ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message.text}
        </div>
      )}
      
      <div className="mb-6 flex justify-between items-center">
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          Create New Class
        </button>
        
        <div>
          <label className="mr-2 text-sm font-medium">Filter by day:</label>
          <select
            value={selectedDay}
            onChange={(e) => setSelectedDay(e.target.value)}
            className="border border-gray-300 rounded-md p-2"
          >
            <option value="">All Days</option>
            {daysOfWeek.map(day => (
              <option key={day} value={day}>{day}</option>
            ))}
          </select>
        </div>
      </div>
      
      {showForm && (
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Create New Class</h2>
          <form onSubmit={handleCreateClass} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Class Name</label>
                <input type="text" required value={newClass.name} onChange={(e) => setNewClass({ ...newClass, name: e.target.value })} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Subject</label>
                <input type="text" required value={newClass.subject} onChange={(e) => setNewClass({ ...newClass, subject: e.target.value })} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Day of Week</label>
                <select required value={newClass.day_of_week} onChange={(e) => setNewClass({ ...newClass, day_of_week: e.target.value })} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                  <option value="">Select</option>
                  {daysOfWeek.map(day => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Time Slot (e.g., 08:00-10:00)</label>
                <input type="text" required value={newClass.time_slot} onChange={(e) => setNewClass({ ...newClass, time_slot: e.target.value })} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Start Time (HH:MM)</label>
                <input type="time" required value={newClass.start_time} onChange={(e) => setNewClass({ ...newClass, start_time: e.target.value })} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Teacher Name</label>
                <input type="text" required value={newClass.teacher_name} onChange={(e) => setNewClass({ ...newClass, teacher_name: e.target.value })} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Max Students</label>
                <input type="number" required value={newClass.max_students} onChange={(e) => setNewClass({ ...newClass, max_students: e.target.value })} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
              </div>
            </div>
            <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">Create Class</button>
          </form>
        </div>
      )}
      
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Day</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teacher</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacity</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredClasses.map(classItem => (
              <tr key={classItem.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{classItem.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{classItem.subject}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{classItem.day_of_week}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{classItem.time_slot}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{classItem.teacher_name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{classItem.max_students}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredClasses.length === 0 && (
          <div className="text-center py-8 text-gray-500">No classes found.</div>
        )}
      </div>
    </div>
  );
}