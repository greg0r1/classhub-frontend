import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '@core/auth/auth.service';
import { StatCardComponent } from '@shared/components/stat-card.component';
import { UpcomingCoursesComponent } from './components/upcoming-courses.component';
import { RecentActivityComponent } from './components/recent-activity.component';
import { AttendanceChartComponent } from './components/attendance-chart.component';

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    StatCardComponent,
    UpcomingCoursesComponent,
    RecentActivityComponent,
    AttendanceChartComponent
  ],
  template: `
    <div class="dashboard">
      <!-- Welcome header -->
      <div class="dashboard-header">
        <h1>Tableau de bord</h1>
        <p class="welcome-text">
          Bienvenue, {{ authService.currentUser()?.firstName }} {{ authService.currentUser()?.lastName }} !
        </p>
      </div>

      <!-- Stats Cards -->
      <div class="stats-grid">
        <app-stat-card
          title="Présences ce mois"
          [value]="12"
          icon="check_circle"
          color="success"
          [trend]="15"
        />
        <app-stat-card
          title="Cours à venir"
          [value]="5"
          icon="event"
          color="primary"
        />
        <app-stat-card
          title="Cours disponibles"
          [value]="23"
          icon="fitness_center"
          color="warning"
        />
        <app-stat-card
          title="Taux de présence"
          value="87%"
          icon="insights"
          color="success"
          [trend]="3"
        />
      </div>

      <!-- Content Grid -->
      <div class="content-grid">
        <!-- Left column -->
        <div class="content-left">
          <app-attendance-chart />
          <app-recent-activity />
        </div>

        <!-- Right column -->
        <div class="content-right">
          <app-upcoming-courses />
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard {
      max-width: 1400px;
      margin: 0 auto;
    }

    .dashboard-header {
      margin-bottom: 32px;
    }

    .dashboard-header h1 {
      font-size: 32px;
      font-weight: 600;
      margin-bottom: 8px;
      color: rgba(0, 0, 0, 0.87);
    }

    .welcome-text {
      font-size: 16px;
      color: rgba(0, 0, 0, 0.6);
      margin: 0;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 24px;
      margin-bottom: 32px;
    }

    .content-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 24px;
    }

    .content-left,
    .content-right {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    @media (max-width: 959px) {
      .stats-grid {
        grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
        gap: 16px;
      }

      .content-grid {
        grid-template-columns: 1fr;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  readonly authService = inject(AuthService);
}
