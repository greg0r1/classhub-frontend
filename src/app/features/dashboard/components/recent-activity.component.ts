import { Component, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';

interface Activity {
  id: string;
  type: 'attendance' | 'enrollment' | 'cancellation';
  course: string;
  date: Date;
  status: 'présent' | 'absent' | 'inscrit' | 'annulé';
}

@Component({
  selector: 'app-recent-activity',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatListModule, MatIconModule, MatChipsModule],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>Activité récente</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        @if (activities().length === 0) {
          <div class="empty-state">
            <mat-icon>history</mat-icon>
            <p>Aucune activité récente</p>
          </div>
        } @else {
          <mat-list>
            @for (activity of activities(); track activity.id) {
              <mat-list-item>
                <mat-icon matListItemIcon [class]="getActivityIconClass(activity.type)">
                  {{ getActivityIcon(activity.type) }}
                </mat-icon>
                <div matListItemTitle>{{ activity.course }}</div>
                <div matListItemLine>{{ formatDate(activity.date) }}</div>
                <div matListItemMeta>
                  <mat-chip [class]="getStatusClass(activity.status)">
                    {{ activity.status }}
                  </mat-chip>
                </div>
              </mat-list-item>
            }
          </mat-list>
        }
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    mat-card {
      height: 100%;
    }

    mat-card-content {
      max-height: 400px;
      overflow-y: auto;
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

    .icon-attendance {
      color: #4caf50;
    }

    .icon-enrollment {
      color: #2196f3;
    }

    .icon-cancellation {
      color: #ff9800;
    }

    .status-présent {
      background-color: #4caf50;
      color: white;
    }

    .status-absent {
      background-color: #f44336;
      color: white;
    }

    .status-inscrit {
      background-color: #2196f3;
      color: white;
    }

    .status-annulé {
      background-color: #ff9800;
      color: white;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecentActivityComponent implements OnInit {
  readonly activities = signal<Activity[]>([]);

  ngOnInit(): void {
    this.loadActivities();
  }

  private loadActivities(): void {
    // TODO: Replace with real API call
    const mockActivities: Activity[] = [
      {
        id: '1',
        type: 'attendance',
        course: 'CrossFit WOD',
        date: new Date(2025, 10, 15, 18, 0),
        status: 'présent'
      },
      {
        id: '2',
        type: 'attendance',
        course: 'Yoga Vinyasa',
        date: new Date(2025, 10, 14, 19, 0),
        status: 'présent'
      },
      {
        id: '3',
        type: 'enrollment',
        course: 'HIIT',
        date: new Date(2025, 10, 13, 10, 30),
        status: 'inscrit'
      },
      {
        id: '4',
        type: 'attendance',
        course: 'CrossFit WOD',
        date: new Date(2025, 10, 12, 18, 0),
        status: 'absent'
      }
    ];
    this.activities.set(mockActivities);
  }

  getActivityIcon(type: string): string {
    switch (type) {
      case 'attendance': return 'check_circle';
      case 'enrollment': return 'person_add';
      case 'cancellation': return 'cancel';
      default: return 'info';
    }
  }

  getActivityIconClass(type: string): string {
    return `icon-${type}`;
  }

  getStatusClass(status: string): string {
    return `status-${status}`;
  }

  formatDate(date: Date): string {
    const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];

    return `${days[date.getDay()]} ${date.getDate()} ${months[date.getMonth()]} à ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
  }
}
