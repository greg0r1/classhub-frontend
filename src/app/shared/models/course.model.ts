/**
 * Modèles TypeScript pour les cours
 * Ces interfaces seront remplacées par les types générés de l'API
 */

export interface Course {
  id: string;
  title: string;
  description?: string;
  course_type: string;
  start_datetime: string;
  end_datetime: string;
  location: string;
  coach_id: string;
  coach?: User;
  max_capacity: number;
  current_attendance: number;
  status: CourseStatus;
  is_recurring: boolean;
  recurrence_rule?: RecurrenceRule;
  organization_id: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  organization_id: string;
}

export type UserRole = 'admin' | 'coach' | 'member';

export type CourseStatus = 'scheduled' | 'ongoing' | 'completed' | 'cancelled';

export interface RecurrenceRule {
  frequency: 'daily' | 'weekly' | 'monthly';
  day_of_week?: number;
  end_date?: string;
}

export interface CourseFilters {
  startDate?: Date;
  endDate?: Date;
  coachId?: string;
  courseType?: string;
  status?: CourseStatus;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface AttendanceIntention {
  course_id: string;
  user_id: string;
  intention: 'will_attend' | 'wont_attend' | 'maybe';
}
