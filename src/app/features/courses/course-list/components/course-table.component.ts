import {
  Component,
  input,
  output,
  signal,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule, Sort } from '@angular/material/sort';
import { Course } from '@app/shared/models/course.model';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

@Component({
  selector: 'app-course-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatTooltipModule,
    MatPaginatorModule,
    MatSortModule,
  ],
  template: `
    <div class="table-container">
      <!-- Table Material -->
      <table mat-table [dataSource]="courses()" matSort (matSortChange)="onSort($event)">
        <!-- Colonne Date -->
        <ng-container matColumnDef="date">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Date</th>
          <td mat-cell *matCellDef="let course">
            {{ formatDate(course.start_datetime) }}
          </td>
        </ng-container>

        <!-- Colonne Heure -->
        <ng-container matColumnDef="time">
          <th mat-header-cell *matHeaderCellDef>Heure</th>
          <td mat-cell *matCellDef="let course">
            {{ formatTime(course.start_datetime) }} - {{ formatTime(course.end_datetime) }}
          </td>
        </ng-container>

        <!-- Colonne Titre -->
        <ng-container matColumnDef="title">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Titre</th>
          <td mat-cell *matCellDef="let course">
            <div class="course-title">
              {{ course.title }}
              @if (course.is_recurring) {
                <mat-icon class="recurring-icon" matTooltip="Cours récurrent" color="primary">
                  repeat
                </mat-icon>
              }
            </div>
          </td>
        </ng-container>

        <!-- Colonne Coach -->
        <ng-container matColumnDef="coach">
          <th mat-header-cell *matHeaderCellDef>Coach</th>
          <td mat-cell *matCellDef="let course">
            @if (course.coach) {
              {{ course.coach.first_name }} {{ course.coach.last_name }}
            } @else {
              <span class="text-muted">Non assigné</span>
            }
          </td>
        </ng-container>

        <!-- Colonne Places -->
        <ng-container matColumnDef="capacity">
          <th mat-header-cell *matHeaderCellDef>Places</th>
          <td mat-cell *matCellDef="let course">
            <span [class.text-warning]="isAlmostFull(course)" [class.text-danger]="isFull(course)">
              {{ course.current_attendance || 0 }}/{{ course.max_capacity }}
            </span>
          </td>
        </ng-container>

        <!-- Colonne Statut -->
        <ng-container matColumnDef="status">
          <th mat-header-cell *matHeaderCellDef>Statut</th>
          <td mat-cell *matCellDef="let course">
            <mat-chip [class]="getStatusClass(course.status)">
              {{ getStatusLabel(course.status) }}
            </mat-chip>
          </td>
        </ng-container>

        <!-- Colonne Actions -->
        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef>Actions</th>
          <td mat-cell *matCellDef="let course">
            <button
              mat-icon-button
              color="primary"
              (click)="onViewDetails(course.id); $event.stopPropagation()"
              matTooltip="Voir les détails"
            >
              <mat-icon>visibility</mat-icon>
            </button>
            @if (canRegister(course)) {
              <button
                mat-icon-button
                color="accent"
                (click)="onRegister(course.id); $event.stopPropagation()"
                matTooltip="S'inscrire"
              >
                <mat-icon>how_to_reg</mat-icon>
              </button>
            }
          </td>
        </ng-container>

        <!-- Définition des lignes -->
        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr
          mat-row
          *matRowDef="let row; columns: displayedColumns"
          class="course-row"
          (click)="onViewDetails(row.id)"
        ></tr>
      </table>

      <!-- Pagination -->
      <mat-paginator
        [length]="totalItems()"
        [pageSize]="pageSize()"
        [pageSizeOptions]="[10, 20, 50]"
        (page)="onPageChange($event)"
        showFirstLastButtons
      >
      </mat-paginator>
    </div>
  `,
  styles: [
    `
      .table-container {
        width: 100%;
        overflow-x: auto;
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      table {
        width: 100%;
      }

      .course-row {
        cursor: pointer;
        transition: background-color 0.2s;
      }

      .course-row:hover {
        background-color: #f5f5f5;
      }

      .course-title {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .recurring-icon {
        font-size: 18px;
        width: 18px;
        height: 18px;
      }

      .text-muted {
        color: #757575;
      }

      .text-warning {
        color: #ff9800;
        font-weight: 500;
      }

      .text-danger {
        color: #f44336;
        font-weight: 500;
      }

      mat-chip {
        font-size: 12px;
        min-height: 24px;
      }

      .status-scheduled {
        background-color: #3f51b5;
        color: white;
      }

      .status-ongoing {
        background-color: #4caf50;
        color: white;
      }

      .status-completed {
        background-color: #757575;
        color: white;
      }

      .status-cancelled {
        background-color: #f44336;
        color: white;
      }

      @media (max-width: 768px) {
        .table-container {
          display: none;
        }
      }
    `,
  ],
})
export class CourseTableComponent {
  // Inputs
  courses = input.required<Course[]>();
  totalItems = input.required<number>();
  pageSize = input<number>(20);
  currentPage = input<number>(1);

  // Outputs
  viewDetails = output<string>();
  register = output<string>();
  pageChange = output<PageEvent>();
  sortChange = output<Sort>();

  // Colonnes affichées
  displayedColumns = ['date', 'time', 'title', 'coach', 'capacity', 'status', 'actions'];

  /**
   * Formater la date
   */
  formatDate(dateString: string): string {
    return format(new Date(dateString), 'dd MMM yyyy', { locale: fr });
  }

  /**
   * Formater l'heure
   */
  formatTime(dateString: string): string {
    return format(new Date(dateString), 'HH:mm');
  }

  /**
   * Obtenir le label du statut
   */
  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      scheduled: 'Planifié',
      ongoing: 'En cours',
      completed: 'Terminé',
      cancelled: 'Annulé',
    };
    return labels[status] || status;
  }

  /**
   * Obtenir la classe CSS du statut
   */
  getStatusClass(status: string): string {
    return `status-${status}`;
  }

  /**
   * Vérifier si le cours est presque complet (>80%)
   */
  isAlmostFull(course: Course): boolean {
    const attendance = course.current_attendance || 0;
    return attendance / course.max_capacity > 0.8 && attendance < course.max_capacity;
  }

  /**
   * Vérifier si le cours est complet
   */
  isFull(course: Course): boolean {
    const attendance = course.current_attendance || 0;
    return attendance >= course.max_capacity;
  }

  /**
   * Vérifier si on peut s'inscrire
   */
  canRegister(course: Course): boolean {
    return course.status === 'scheduled' && !this.isFull(course);
  }

  /**
   * Voir les détails
   */
  onViewDetails(courseId: string): void {
    this.viewDetails.emit(courseId);
  }

  /**
   * S'inscrire au cours
   */
  onRegister(courseId: string): void {
    this.register.emit(courseId);
  }

  /**
   * Changement de page
   */
  onPageChange(event: PageEvent): void {
    this.pageChange.emit(event);
  }

  /**
   * Changement de tri
   */
  onSort(event: Sort): void {
    this.sortChange.emit(event);
  }
}
