// app/parents-students/page.tsx
'use client';

import { useState, useEffect } from 'react';

interface Parent {
  id: string;
  name: string;
  phone: string;
  email: string;
}

interface Student {
  id: string;
  name: string;
  dob: string;
  gender: string;
  current_grade: string;
  parent_id: string;
}

export default function ParentsStudents() {
  const [parents, setParents] = useState<Parent[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [showParentForm, setShowParentForm] = useState(false);
  const [showStudentForm, setShowStudentForm] = useState(false);
  const [newParent, setNewParent] = useState({ name: '', phone: '', email: '' });
  const [newStudent, setNewStudent] = useState({ name: '', dob: '', gender: '', current_grade: '', parent_id: '' });
  const [message, setMessage] = useState<{ type: string; text: string } | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const parentsRes = await fetch('/api/parents');
    const studentsRes = await fetch('/api/students');
    setParents(await parentsRes.json());
    setStudents(await studentsRes.json());
  };

  const handleCreateParent = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/parents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newParent),
    });
    if (res.ok) {
      setMessage({ type: 'success', text: 'Parent created successfully!' });
      setNewParent({ name: '', phone: '', email: '' });
      setShowParentForm(false);
      fetchData();
      setTimeout(() => setMessage(null), 3000);
    } else {
      const error = await res.json();
      setMessage({ type: 'error', text: error.error });
    }
  };

  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newStudent),
    });
    if (res.ok) {
      setMessage({ type: 'success', text: 'Student created successfully!' });
      setNewStudent({ name: '', dob: '', gender: '', current_grade: '', parent_id: '' });
      setShowStudentForm(false);
      fetchData();
      setTimeout(() => setMessage(null), 3000);
    } else {
      const error = await res.json();
      setMessage({ type: 'error', text: error.error });
    }
  };

  const viewStudentDetails = async (studentId: string) => {
    const res = await fetch(`/api/students/${studentId}`);
    const data = await res.json();
    setSelectedStudent(data);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Parents & Students</h1>
      
      {message && (
        <div className={`mb-4 p-4 rounded-md ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message.text}
        </div>
      )}
      
      <div className="mb-6 flex space-x-4">
        <button
          onClick={() => setShowParentForm(!showParentForm)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          Add Parent
        </button>
        <button
          onClick={() => setShowStudentForm(!showStudentForm)}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
        >
          Add Student
        </button>
      </div>
      
      {showParentForm && (
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Create New Parent</h2>
          <form onSubmit={handleCreateParent} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input type="text" required value={newParent.name} onChange={(e) => setNewParent({ ...newParent, name: e.target.value })} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input type="text" required value={newParent.phone} onChange={(e) => setNewParent({ ...newParent, phone: e.target.value })} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input type="email" required value={newParent.email} onChange={(e) => setNewParent({ ...newParent, email: e.target.value })} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
            </div>
            <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">Create Parent</button>
          </form>
        </div>
      )}
      
      {showStudentForm && (
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Create New Student</h2>
          <form onSubmit={handleCreateStudent} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input type="text" required value={newStudent.name} onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
              <input type="date" required value={newStudent.dob} onChange={(e) => setNewStudent({ ...newStudent, dob: e.target.value })} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Gender</label>
              <select required value={newStudent.gender} onChange={(e) => setNewStudent({ ...newStudent, gender: e.target.value })} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Current Grade</label>
              <input type="text" required value={newStudent.current_grade} onChange={(e) => setNewStudent({ ...newStudent, current_grade: e.target.value })} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Parent</label>
              <select required value={newStudent.parent_id} onChange={(e) => setNewStudent({ ...newStudent, parent_id: e.target.value })} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                <option value="">Select Parent</option>
                {parents.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">Create Student</button>
          </form>
        </div>
      )}
      
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Parents List</h2>
          <div className="space-y-3">
            {parents.map(parent => (
              <div key={parent.id} className="border-b pb-3">
                <p className="font-medium">{parent.name}</p>
                <p className="text-sm text-gray-600">Phone: {parent.phone}</p>
                <p className="text-sm text-gray-600">Email: {parent.email}</p>
              </div>
            ))}
            {parents.length === 0 && <p className="text-gray-500">No parents yet.</p>}
          </div>
        </div>
        
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Students List</h2>
          <div className="space-y-3">
            {students.map(student => (
              <div key={student.id} className="border-b pb-3">
                <p className="font-medium">{student.name}</p>
                <p className="text-sm text-gray-600">Grade: {student.current_grade}</p>
                <button onClick={() => viewStudentDetails(student.id)} className="text-indigo-600 hover:text-indigo-800 text-sm mt-1">
                  View Details
                </button>
              </div>
            ))}
            {students.length === 0 && <p className="text-gray-500">No students yet.</p>}
          </div>
        </div>
      </div>
      
      {selectedStudent && (
        <div className="mt-6 bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Student Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p className="font-medium">{selectedStudent.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Date of Birth</p>
              <p className="font-medium">{selectedStudent.dob}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Gender</p>
              <p className="font-medium">{selectedStudent.gender}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Current Grade</p>
              <p className="font-medium">{selectedStudent.current_grade}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Parent Name</p>
              <p className="font-medium">{selectedStudent.parent?.name || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Parent Contact</p>
              <p className="font-medium">{selectedStudent.parent?.phone || 'N/A'}</p>
            </div>
          </div>
          <button onClick={() => setSelectedStudent(null)} className="mt-4 text-gray-600 hover:text-gray-800">Close</button>
        </div>
      )}
    </div>
  );
}