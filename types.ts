export type Role = 'student' | 'professor' | 'preceptor' | 'student_union_member';
export type Career = 'software' | 'design';

export interface User {
  name: string;
  role: Role;
  career: Career;
  email: string;
  profilePictureUrl?: string;
  studentId?: string;
  yearOfStudy?: string;
  aboutMe?: string;
}

export interface Theme {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  textPrimary: string;
  textSecondary: string;
}

export type AttendanceStatus = 'present' | 'absent' | 'justified' | 'late';

export interface AttendanceRecord {
  id: number;
  date: string;
  subject: string;
  status: AttendanceStatus;
}

export interface ChatMessage {
  author: 'user' | 'model' | 'preceptor' | 'student' | 'professor' | 'student_union';
  content: string;
}

export interface GradeStat {
    subject: string;
    firstSemester: number | null;
    secondSemester: number | null;
    finalGrade: number | null;
}

export interface ScheduleItem {
  day: string;
  time: string;
  subject:string;
  location: string;
}

export type CalendarEventType = 'class' | 'exam' | 'final' | 'event' | 'reminder';

export interface CalendarEvent {
  date: string; // YYYY-MM-DD
  title: string;
  type: CalendarEventType;
  time?: string;
  color?: string;
}

export interface ForumAnswer {
  id: number;
  author: string;
  role: 'professor' | 'preceptor';
  content: string;
  timestamp: string;
}

export interface ForumPost {
  id: number;
  author: string;
  title: string;
  description: string;
  timestamp: string;
  answers: ForumAnswer[];
}

export interface UpcomingDeadline {
  id: string;
  title: string;
  subject: string;
  dueDate: string; // ISO string format
  type: 'assignment' | 'exam';
}

export interface Notification {
  id: string;
  icon: 'BookOpenIcon' | 'BellIcon' | 'GraduationCapIcon' | 'MaterialsIcon' | 'CommunicationsIcon' | 'CalendarIcon' | 'HelpCircleIcon';
  title: string;
  description: string;
  action: {
    type: 'navigate' | 'modal';
    target: string;
  };
}

export interface AssignmentToGrade {
  id: string;
  subject: string;
  title: string;
  submissions: number;
  totalStudents: number;
  dueDate: string;
}

// Professor specific types
export interface ProfessorCourse {
  subject: string;
  years: string[];
}

export interface StudentGradeRecord {
    id: string;
    name: string;
    studentId: string;
    firstSemester: number | null;
    secondSemester: number | null;
}

export interface StudentDailyAttendance {
    id: string;
    name: string;
    studentId: string;
    status: AttendanceStatus | 'unmarked';
}

// Types for Inbox feature
export interface Conversation {
  id: string;
  name: string;
  profilePictureUrl?: string;
  lastMessage: string;
  lastMessageTimestamp: string;
  unreadCount: number;
  isOnline: boolean;
  type: 'student' | 'professor';
}

export interface FullConversation extends Conversation {
  messages: ChatMessage[];
}

// Preceptor Report Types
export interface AttendanceSummary {
  subject: string;
  present: number;
  absent: number;
  justified: number;
}

export interface AtRiskStudent {
  id: string;
  name: string;
  reason: 'Baja Asistencia' | 'Notas Bajas';
  subject: string;
  value: string; // e.g., "55%" or "Promedio: 3.5"
}

// Preceptor Task Type
export interface PreceptorTask {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  action?: {
    type: 'navigate';
    target: string;
  };
}

// Fix: Add types for Student File feature
export interface StudentSearchResult {
  id: string;
  name: string;
  studentId: string;
}

export interface ObservationRecord {
  id: string;
  author: string;
  timestamp: string; // ISO string
  content: string;
}

export interface StudentFile {
  user: User;
  grades: GradeStat[];
  attendance: AttendanceRecord[];
  observations: ObservationRecord[];
}

export interface Procedure {
  id: string;
  title: string;
  description: string;
  icon: 'MaterialsIcon' | 'PenSquareIcon' | 'CalendarIcon';
}

export interface ProcedureRequest {
  id: string;
  studentName: string;
  studentId: string;
  procedureTitle: string;
  status: 'pending' | 'approved' | 'rejected';
  requestDate: string; // ISO String
}

export interface ChatContact {
    id: string;
    name: string;
    profilePictureUrl: string;
    isOnline: boolean;
}