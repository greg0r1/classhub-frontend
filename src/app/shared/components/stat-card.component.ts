import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  template: `
    <mat-card [class]="'stat-card stat-card-' + color()">
      <mat-card-content>
        <div class="stat-header">
          <mat-icon class="stat-icon">{{ icon() }}</mat-icon>
        </div>
        <div class="stat-body">
          <h3 class="stat-value">{{ value() }}</h3>
          <p class="stat-title">{{ title() }}</p>
        </div>
        @if (trend(); as trendValue) {
          <div class="stat-trend" [class.positive]="trendValue > 0" [class.negative]="trendValue < 0">
            <mat-icon class="trend-icon">
              {{ trendValue > 0 ? 'trending_up' : trendValue < 0 ? 'trending_down' : 'trending_flat' }}
            </mat-icon>
            <span class="trend-value">{{ Math.abs(trendValue) }}%</span>
          </div>
        }
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .stat-card {
      height: 100%;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .stat-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    }

    mat-card-content {
      padding: 24px !important;
    }

    .stat-header {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 16px;
    }

    .stat-icon {
      width: 48px;
      height: 48px;
      font-size: 48px;
      opacity: 0.2;
    }

    .stat-body {
      margin-bottom: 12px;
    }

    .stat-value {
      font-size: 32px;
      font-weight: 700;
      margin: 0 0 8px;
      line-height: 1;
    }

    .stat-title {
      font-size: 14px;
      color: rgba(0, 0, 0, 0.6);
      margin: 0;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .stat-trend {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 14px;
      font-weight: 600;
    }

    .stat-trend.positive {
      color: #4caf50;
    }

    .stat-trend.negative {
      color: #f44336;
    }

    .trend-icon {
      width: 20px;
      height: 20px;
      font-size: 20px;
    }

    /* Color variants */
    .stat-card-primary {
      border-left: 4px solid #3f51b5;
    }

    .stat-card-primary .stat-icon {
      color: #3f51b5;
    }

    .stat-card-success {
      border-left: 4px solid #4caf50;
    }

    .stat-card-success .stat-icon {
      color: #4caf50;
    }

    .stat-card-warning {
      border-left: 4px solid #ff9800;
    }

    .stat-card-warning .stat-icon {
      color: #ff9800;
    }

    .stat-card-error {
      border-left: 4px solid #f44336;
    }

    .stat-card-error .stat-icon {
      color: #f44336;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatCardComponent {
  readonly title = input.required<string>();
  readonly value = input.required<string | number>();
  readonly icon = input.required<string>();
  readonly color = input<'primary' | 'success' | 'warning' | 'error'>('primary');
  readonly trend = input<number>();

  readonly Math = Math;
}
