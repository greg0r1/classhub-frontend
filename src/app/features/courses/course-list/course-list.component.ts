import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { CourseService } from '@app/core/services/course.service';
import { AuthService } from '@app/core/auth/auth.service';
import { Course, CourseFilters } from '@app/shared/models/course.model';
import { CourseFiltersComponent } from './components/course-filters.component';
import { CourseTableComponent } from './components/course-table.component';

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
    CourseFiltersComponent,
    CourseTableComponent,
  ],
  template: `
    <div class="course-list-container">
      <!-- En-tête -->
      <div class="header">
        <h1>
          <mat-icon>event</mat-icon>
          Liste des cours
        </h1>
        @if (isCoach()) {
          <button mat-raised-button color="primary" (click)="createCourse()">
            <mat-icon>add</mat-icon>
            Créer un cours
          </button>
        }
      </div>

      <!-- Filtres -->
      <app-course-filters (filtersChange)="onFiltersChange($event)"></app-course-filters>

      <!-- Chargement -->
      @if (loading()) {
        <div class="loading-container">
          <mat-spinner diameter="50"></mat-spinner>
          <p>Chargement des cours...</p>
        </div>
      }

      <!-- Tableau des cours -->
      @if (!loading()) {
        @if (courses().length > 0) {
          <app-course-table
            [courses]="courses()"
            [totalItems]="totalItems()"
            [pageSize]="pageSize()"
            [currentPage]="currentPage()"
            (viewDetails)="viewCourseDetails($event)"
            (register)="registerToCourse($event)"
            (pageChange)="onPageChange($event)"
            (sortChange)="onSortChange($event)"
          ></app-course-table>
        } @else {
          <div class="empty-state">
            <mat-icon>event_busy</mat-icon>
            <h2>Aucun cours trouvé</h2>
            <p>Essayez de modifier vos critères de recherche ou créez un nouveau cours.</p>
            @if (isCoach()) {
              <button mat-raised-button color="primary" (click)="createCourse()">
                <mat-icon>add</mat-icon>
                Créer un cours
              </button>
            }
          </div>
        }
      }

      <!-- Message d'erreur -->
      @if (error()) {
        <div class="error-container">
          <mat-icon color="warn">error</mat-icon>
          <p>{{ error() }}</p>
          <button mat-raised-button (click)="loadCourses()">Réessayer</button>
        </div>
      }
    </div>
  `,
  styles: [
    `
      .course-list-container {
        padding: 2rem;
        max-width: 1400px;
        margin: 0 auto;
      }

      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
      }

      .header h1 {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin: 0;
        font-size: 2rem;
        color: #333;
      }

      .header h1 mat-icon {
        font-size: 2rem;
        width: 2rem;
        height: 2rem;
      }

      .loading-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 4rem;
        gap: 1rem;
      }

      .loading-container p {
        color: #757575;
        font-size: 1rem;
      }

      .empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 4rem;
        text-align: center;
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      .empty-state mat-icon {
        font-size: 64px;
        width: 64px;
        height: 64px;
        color: #bdbdbd;
        margin-bottom: 1rem;
      }

      .empty-state h2 {
        margin: 1rem 0 0.5rem;
        color: #424242;
      }

      .empty-state p {
        color: #757575;
        margin-bottom: 1.5rem;
      }

      .error-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 2rem;
        gap: 1rem;
        background: #ffebee;
        border-radius: 8px;
        margin-top: 1rem;
      }

      .error-container mat-icon {
        font-size: 48px;
        width: 48px;
        height: 48px;
      }

      .error-container p {
        color: #c62828;
        margin: 0;
      }

      @media (max-width: 768px) {
        .course-list-container {
          padding: 1rem;
        }

        .header {
          flex-direction: column;
          align-items: flex-start;
          gap: 1rem;
        }

        .header button {
          width: 100%;
        }
      }
    `,
  ],
})
export class CourseListComponent implements OnInit {
  private readonly courseService = inject(CourseService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);

  // Signals
  courses = signal<Course[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  totalItems = signal(0);
  currentPage = signal(1);
  pageSize = signal(20);
  filters = signal<CourseFilters>({});
  sortField = signal<string>('start_datetime');
  sortDirection = signal<'asc' | 'desc'>('asc');

  // Computed pour vérifier si l'utilisateur est coach/admin
  isCoach = this.authService.isCoach;

  ngOnInit(): void {
    this.loadCourses();
  }

  /**
   * Charger la liste des cours
   */
  loadCourses(): void {
    this.loading.set(true);
    this.error.set(null);

    this.courseService
      .getCourses(this.currentPage(), this.pageSize(), this.filters())
      .subscribe({
        next: (response) => {
          this.courses.set(response.data);
          this.totalItems.set(response.total);
          this.loading.set(false);
        },
        error: (err) => {
          console.error('Erreur lors du chargement des cours:', err);
          this.error.set('Impossible de charger la liste des cours. Veuillez réessayer.');
          this.loading.set(false);
          this.snackBar.open('Erreur lors du chargement des cours', 'Fermer', {
            duration: 5000,
            panelClass: ['error-snackbar'],
          });
        },
      });
  }

  /**
   * Gérer le changement de filtres
   */
  onFiltersChange(filters: CourseFilters): void {
    console.log('onFiltersChange appelé avec:', filters);
    this.filters.set(filters);
    this.currentPage.set(1); // Retour à la première page
    this.loadCourses();
  }

  /**
   * Gérer le changement de page
   */
  onPageChange(event: PageEvent): void {
    this.currentPage.set(event.pageIndex + 1);
    this.pageSize.set(event.pageSize);
    this.loadCourses();
  }

  /**
   * Gérer le changement de tri
   */
  onSortChange(sort: Sort): void {
    if (sort.active && sort.direction) {
      this.sortField.set(sort.active);
      this.sortDirection.set(sort.direction as 'asc' | 'desc');
      // TODO: Implémenter le tri côté serveur
      this.loadCourses();
    }
  }

  /**
   * Voir les détails d'un cours
   */
  viewCourseDetails(courseId: string): void {
    this.router.navigate(['/app/courses', courseId]);
  }

  /**
   * S'inscrire à un cours
   */
  registerToCourse(courseId: string): void {
    const currentUser = this.authService.currentUser();
    if (!currentUser) {
      this.snackBar.open('Vous devez être connecté pour vous inscrire', 'Fermer', {
        duration: 3000,
      });
      return;
    }

    this.courseService
      .createAttendanceIntention({
        course_id: courseId,
        user_id: currentUser.id,
        intention: 'will_attend',
      })
      .subscribe({
        next: () => {
          this.snackBar.open('Inscription réussie !', 'Fermer', {
            duration: 3000,
            panelClass: ['success-snackbar'],
          });
          this.loadCourses(); // Recharger pour mettre à jour le compteur
        },
        error: (err) => {
          console.error("Erreur lors de l'inscription:", err);
          this.snackBar.open("Erreur lors de l'inscription au cours", 'Fermer', {
            duration: 5000,
            panelClass: ['error-snackbar'],
          });
        },
      });
  }

  /**
   * Créer un nouveau cours (coach/admin)
   */
  createCourse(): void {
    this.router.navigate(['/app/courses/new']);
  }
}
