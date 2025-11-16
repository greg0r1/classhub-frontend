import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap, map } from 'rxjs';
import { environment } from '@environments/environment';
import {
  Course,
  CourseFilters,
  PaginatedResponse,
  AttendanceIntention,
} from '@app/shared/models/course.model';

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/courses`;
  private readonly attendancesUrl = `${environment.apiUrl}/attendances`;

  // Signal pour le chargement
  readonly loading = signal(false);

  /**
   * Récupérer la liste des cours avec filtres et pagination
   */
  getCourses(
    page: number = 1,
    limit: number = 20,
    filters?: CourseFilters
  ): Observable<PaginatedResponse<Course>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    // Ajouter les filtres seulement s'ils ont une valeur
    if (filters?.startDate) {
      const dateStr = filters.startDate.toISOString();
      params = params.set('start_date', dateStr);
      console.log('Filtre start_date:', dateStr);
    }
    if (filters?.endDate) {
      const dateStr = filters.endDate.toISOString();
      params = params.set('end_date', dateStr);
      console.log('Filtre end_date:', dateStr);
    }
    if (filters?.coachId) {
      params = params.set('coach_id', filters.coachId);
      console.log('Filtre coach_id:', filters.coachId);
    }
    if (filters?.courseType) {
      params = params.set('course_type', filters.courseType);
      console.log('Filtre course_type:', filters.courseType);
    }
    if (filters?.status) {
      params = params.set('status', filters.status);
      console.log('Filtre status:', filters.status);
    }

    const url = `${this.apiUrl}?${params.toString()}`;
    console.log('URL finale:', url);

    this.loading.set(true);
    return this.http.get<Course[]>(this.apiUrl, { params }).pipe(
      tap({
        next: (response) => {
          console.log('Réponse API (tableau):', response);
        },
        error: (error) => {
          console.error('Erreur API:', error);
          this.loading.set(false);
        }
      }),
      // Transformer le tableau en PaginatedResponse
      map((courses: Course[]): PaginatedResponse<Course> => {
        this.loading.set(false);
        return {
          data: courses,
          total: courses.length,
          page: page,
          limit: limit
        };
      })
    );
  }

  /**
   * Récupérer un cours par son ID
   */
  getCourseById(id: string): Observable<Course> {
    this.loading.set(true);
    return this.http.get<Course>(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.loading.set(false))
    );
  }

  /**
   * Créer une intention de présence (inscription)
   */
  createAttendanceIntention(data: AttendanceIntention): Observable<any> {
    return this.http.post(`${this.attendancesUrl}/intention`, data);
  }

  /**
   * Supprimer une intention de présence (désinscription)
   */
  deleteAttendanceIntention(attendanceId: string): Observable<any> {
    return this.http.delete(`${this.attendancesUrl}/${attendanceId}`);
  }

  /**
   * Récupérer les inscrits à un cours
   */
  getCourseAttendees(courseId: string): Observable<any[]> {
    const params = new HttpParams().set('course_id', courseId);
    return this.http.get<any[]>(this.attendancesUrl, { params });
  }

  /**
   * Créer un nouveau cours
   */
  createCourse(courseData: Partial<Course>): Observable<Course> {
    return this.http.post<Course>(this.apiUrl, courseData);
  }

  /**
   * Mettre à jour un cours
   */
  updateCourse(id: string, courseData: Partial<Course>): Observable<Course> {
    return this.http.patch<Course>(`${this.apiUrl}/${id}`, courseData);
  }

  /**
   * Supprimer un cours
   */
  deleteCourse(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * Annuler un cours
   */
  cancelCourse(id: string): Observable<Course> {
    return this.updateCourse(id, { status: 'cancelled' });
  }
}
