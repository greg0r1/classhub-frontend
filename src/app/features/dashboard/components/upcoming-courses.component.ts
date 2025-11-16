import { Component, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';

interface Course {
  id: string;
  title: string;
  date: Date;
  duration: string;
  coach: string;
  spots: { available: number; total: number };
}

@Component({
  selector: 'app-upcoming-courses',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule
  ],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>Prochains cours</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        @if (courses().length === 0) {
          <div class="empty-state">
            <mat-icon>event_busy</mat-icon>
            <p>Aucun cours prévu</p>
          </div>
        } @else {
          <mat-list>
            @for (course of courses(); track course.id) {
              <mat-list-item>
                <mat-icon matListItemIcon>event</mat-icon>
                <div matListItemTitle>{{ course.title }}</div>
                <div matListItemLine>
                  {{ formatDate(course.date) }} • {{ course.duration }}
                </div>
                <div matListItemMeta>
                  <mat-chip>{{ course.spots.available }}/{{ course.spots.total }}</mat-chip>
                </div>
              </mat-list-item>
            }
          </mat-list>
        }
      </mat-card-content>
      <mat-card-actions>
        <button mat-button color="primary" routerLink="/app/courses">
          Voir tous les cours
        </button>
      </mat-card-actions>
    </mat-card>
  `,
  styles: [`
    mat-card {
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    mat-card-content {
      flex: 1;
      overflow-y: auto;
      max-height: 400px;
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 48px 24px;
      color: rgba(0, 0, 0, 0.38);
    }

    .empty-state mat-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      margin-bottom: 16px;
    }

    mat-list-item {
      border-bottom: 1px solid rgba(0, 0, 0, 0.12);
    }

    mat-list-item:last-child {
      border-bottom: none;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UpcomingCoursesComponent implements OnInit {
  readonly courses = signal<Course[]>([]);

  ngOnInit(): void {
    this.loadCourses();
  }

  private loadCourses(): void {
    // TODO: Replace with real API call
    const mockCourses: Course[] = [
      {
        id: '1',
        title: 'CrossFit WOD',
        date: new Date(2025, 10, 18, 18, 0),
        duration: '1h',
        coach: 'Marie Martin',
        spots: { available: 12, total: 15 }
      },
      {
        id: '2',
        title: 'Yoga Vinyasa',
        date: new Date(2025, 10, 19, 19, 0),
        duration: '1h30',
        coach: 'Sophie Dubois',
        spots: { available: 8, total: 20 }
      },
      {
        id: '3',
        title: 'HIIT',
        date: new Date(2025, 10, 20, 17, 30),
        duration: '45min',
        coach: 'Pierre Durant',
        spots: { available: 15, total: 15 }
      }
    ];
    this.courses.set(mockCourses);
  }

  formatDate(date: Date): string {
    const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];

    return `${days[date.getDay()]} ${date.getDate()} ${months[date.getMonth()]} • ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
  }
}
