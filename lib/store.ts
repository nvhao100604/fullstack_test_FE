// lib/store.ts
// ============================================================
// MOCK DATA STORE — In-memory "database" dùng cho development
// ============================================================
// KHI TÍCH HỢP API THẬT:
//   - Xoá toàn bộ file này
//   - Thay tất cả import từ '@/lib/store' bằng các service/repository thật
//   - Mỗi helper function (getStudentById, v.v.) sẽ map sang 1 DB query
// ============================================================

// ─── INTERFACES ──────────────────────────────────────────────

export interface Parent {
  id: string;
  name: string;
  phone: string;
  email: string;
}

export interface Student {
  id: string;
  name: string;
  dob: string;          // YYYY-MM-DD
  gender: string;
  current_grade: string;
  parent_id: string;
}

export interface Class {
  id: string;
  name: string;
  subject: string;
  day_of_week: string;  // Monday, Tuesday, ...
  time_slot: string;    // "08:00-10:00"
  start_time: string;   // "08:00"
  teacher_name: string;
  max_students: number;
}

export interface ClassRegistration {
  id: string;
  class_id: string;
  student_id: string;
  registered_at: string; // ISO date string
}

export interface Subscription {
  id: string;
  student_id: string;
  package_name: string;
  start_date: string;   // YYYY-MM-DD
  end_date: string;     // YYYY-MM-DD
  total_sessions: number;
  used_sessions: number;
}

// ─── MOCK DATA ────────────────────────────────────────────────
// TODO [API]: Thay thế bằng dữ liệu từ database thật
//             Ví dụ: const parents = await db.parent.findMany()

export const parents: Parent[] = [
  {
    id: 'parent-001',
    name: 'Nguyễn Thị Lan',
    phone: '0901234567',
    email: 'lan.nguyen@gmail.com',
  },
  {
    id: 'parent-002',
    name: 'Trần Văn Minh',
    phone: '0912345678',
    email: 'minh.tran@yahoo.com',
  },
  {
    id: 'parent-003',
    name: 'Lê Thị Hoa',
    phone: '0923456789',
    email: 'hoa.le@outlook.com',
  },
  {
    id: 'parent-004',
    name: 'Phạm Quốc Hùng',
    phone: '0934567890',
    email: 'hung.pham@gmail.com',
  },
  {
    id: 'parent-005',
    name: 'Hoàng Thị Mai',
    phone: '0945678901',
    email: 'mai.hoang@gmail.com',
  },
];

export const students: Student[] = [
  {
    id: 'student-001',
    name: 'Nguyễn Minh Khoa',
    dob: '2015-03-12',
    gender: 'Male',
    current_grade: 'Grade 4',
    parent_id: 'parent-001',
  },
  {
    id: 'student-002',
    name: 'Nguyễn Thu Hà',
    dob: '2017-07-25',
    gender: 'Female',
    current_grade: 'Grade 2',
    parent_id: 'parent-001',
  },
  {
    id: 'student-003',
    name: 'Trần Đức Anh',
    dob: '2014-11-08',
    gender: 'Male',
    current_grade: 'Grade 5',
    parent_id: 'parent-002',
  },
  {
    id: 'student-004',
    name: 'Lê Khánh Linh',
    dob: '2016-05-30',
    gender: 'Female',
    current_grade: 'Grade 3',
    parent_id: 'parent-003',
  },
  {
    id: 'student-005',
    name: 'Phạm Bảo Long',
    dob: '2013-09-15',
    gender: 'Male',
    current_grade: 'Grade 6',
    parent_id: 'parent-004',
  },
  {
    id: 'student-006',
    name: 'Hoàng Ngọc Bích',
    dob: '2016-02-14',
    gender: 'Female',
    current_grade: 'Grade 3',
    parent_id: 'parent-005',
  },
];

export const classes: Class[] = [
  {
    id: 'class-001',
    name: 'Toán Nâng Cao A1',
    subject: 'Mathematics',
    day_of_week: 'Monday',
    time_slot: '08:00-10:00',
    start_time: '08:00',
    teacher_name: 'Cô Nguyễn Thanh Tuyền',
    max_students: 15,
  },
  {
    id: 'class-002',
    name: 'Tiếng Anh Giao Tiếp B1',
    subject: 'English',
    day_of_week: 'Tuesday',
    time_slot: '14:00-16:00',
    start_time: '14:00',
    teacher_name: 'Thầy David Wilson',
    max_students: 12,
  },
  {
    id: 'class-003',
    name: 'Vật Lý Cơ Bản',
    subject: 'Physics',
    day_of_week: 'Wednesday',
    time_slot: '09:00-11:00',
    start_time: '09:00',
    teacher_name: 'Thầy Lê Quang Vinh',
    max_students: 20,
  },
  {
    id: 'class-004',
    name: 'Lập Trình Scratch',
    subject: 'Computer Science',
    day_of_week: 'Saturday',
    time_slot: '08:30-10:30',
    start_time: '08:30',
    teacher_name: 'Cô Phạm Minh Châu',
    max_students: 10,
  },
  {
    id: 'class-005',
    name: 'Tiếng Việt Nâng Cao',
    subject: 'Vietnamese',
    day_of_week: 'Thursday',
    time_slot: '15:00-17:00',
    start_time: '15:00',
    teacher_name: 'Cô Trần Thị Bình',
    max_students: 18,
  },
  {
    id: 'class-006',
    name: 'Toán Tư Duy',
    subject: 'Mathematics',
    day_of_week: 'Sunday',
    time_slot: '09:00-11:00',
    start_time: '09:00',
    teacher_name: 'Thầy Vũ Đình Hải',
    max_students: 15,
  },
];

export const subscriptions: Subscription[] = [
  {
    id: 'sub-001',
    student_id: 'student-001',
    package_name: 'Gói Tháng - 8 Buổi',
    start_date: '2026-04-01',
    end_date: '2026-04-30',
    total_sessions: 8,
    used_sessions: 3,
  },
  {
    id: 'sub-002',
    student_id: 'student-002',
    package_name: 'Gói Tháng - 8 Buổi',
    start_date: '2026-04-01',
    end_date: '2026-04-30',
    total_sessions: 8,
    used_sessions: 1,
  },
  {
    id: 'sub-003',
    student_id: 'student-003',
    package_name: 'Gói Quý - 24 Buổi',
    start_date: '2026-03-01',
    end_date: '2026-05-31',
    total_sessions: 24,
    used_sessions: 10,
  },
  {
    id: 'sub-004',
    student_id: 'student-004',
    package_name: 'Gói Tháng - 8 Buổi',
    start_date: '2026-04-01',
    end_date: '2026-04-30',
    total_sessions: 8,
    used_sessions: 5,
  },
  {
    id: 'sub-005',
    student_id: 'student-005',
    package_name: 'Gói Quý - 24 Buổi',
    start_date: '2026-02-01',
    end_date: '2026-04-30',
    total_sessions: 24,
    used_sessions: 20,
  },
  {
    id: 'sub-006',
    student_id: 'student-006',
    package_name: 'Gói Tháng - 4 Buổi',
    start_date: '2026-04-01',
    end_date: '2026-04-30',
    total_sessions: 4,
    used_sessions: 0,
  },
  // Subscription hết hạn — dùng để test expired case
  {
    id: 'sub-expired',
    student_id: 'student-005',
    package_name: 'Gói Tháng - 8 Buổi (Hết hạn)',
    start_date: '2026-01-01',
    end_date: '2026-01-31',
    total_sessions: 8,
    used_sessions: 8,
  },
];

export const classRegistrations: ClassRegistration[] = [
  // student-001 học Toán Nâng Cao A1 (class-001)
  {
    id: 'reg-001',
    class_id: 'class-001',
    student_id: 'student-001',
    registered_at: '2026-04-01T08:00:00.000Z',
  },
  // student-003 học Tiếng Anh B1 (class-002)
  {
    id: 'reg-002',
    class_id: 'class-002',
    student_id: 'student-003',
    registered_at: '2026-04-02T09:30:00.000Z',
  },
  // student-004 học Toán Nâng Cao A1 (class-001)
  {
    id: 'reg-003',
    class_id: 'class-001',
    student_id: 'student-004',
    registered_at: '2026-04-03T10:15:00.000Z',
  },
  // student-005 học Lập Trình Scratch (class-004)
  {
    id: 'reg-004',
    class_id: 'class-004',
    student_id: 'student-005',
    registered_at: '2026-04-04T07:45:00.000Z',
  },
  // student-002 học Tiếng Việt Nâng Cao (class-005)
  {
    id: 'reg-005',
    class_id: 'class-005',
    student_id: 'student-002',
    registered_at: '2026-04-05T11:00:00.000Z',
  },
];

// ─── HELPER FUNCTIONS ─────────────────────────────────────────
// TODO [API]: Mỗi function bên dưới sẽ được thay bằng 1 DB query:
//   getParentById(id)    → SELECT * FROM parents WHERE id = ?
//   getStudentById(id)   → SELECT * FROM students WHERE id = ?
//   getClassById(id)     → SELECT * FROM classes WHERE id = ?
//   ...

export function getParentById(id: string): Parent | undefined {
  return parents.find(p => p.id === id);
}

export function getStudentById(id: string): Student | undefined {
  return students.find(s => s.id === id);
}

export function getClassById(id: string): Class | undefined {
  return classes.find(c => c.id === id);
}

export function getRegistrationsByStudentId(studentId: string): ClassRegistration[] {
  return classRegistrations.filter(r => r.student_id === studentId);
}

export function getRegistrationsByClassId(classId: string): ClassRegistration[] {
  return classRegistrations.filter(r => r.class_id === classId);
}

export function getSubscriptionByStudentId(studentId: string): Subscription | undefined {
  // TODO [API]: SELECT * FROM subscriptions
  //             WHERE student_id = ? AND end_date >= CURDATE()
  //             ORDER BY end_date DESC LIMIT 1
  const today = new Date().toISOString().split('T')[0];
  return subscriptions.find(s => s.student_id === studentId && s.end_date >= today);
}

// ─── ID GENERATOR ─────────────────────────────────────────────
// TODO [API]: Thay bằng auto-increment hoặc UUID từ DB
//             Ví dụ PostgreSQL: DEFAULT gen_random_uuid()
export function generateId(): string {
  return Date.now().toString() + Math.random().toString(36).substr(2, 6);
}
