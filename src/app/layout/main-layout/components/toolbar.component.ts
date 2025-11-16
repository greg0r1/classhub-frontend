import { Component, output, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDividerModule } from '@angular/material/divider';
import { Router } from '@angular/router';
import { AuthService } from '@core/auth/auth.service';
import { NotificationCenterComponent } from '@shared/components/notification-center.component';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatBadgeModule,
    MatDividerModule,
    NotificationCenterComponent
  ],
  template: `
    <mat-toolbar class="toolbar">
      <!-- Menu button for mobile -->
      <button
        mat-icon-button
        (click)="menuClick.emit()"
        class="menu-button"
      >
        <mat-icon>menu</mat-icon>
      </button>

      <span class="toolbar-spacer"></span>

      <!-- Notifications -->
      <app-notification-center />

      <!-- User menu -->
      <button mat-icon-button [matMenuTriggerFor]="userMenu">
        <mat-icon>account_circle</mat-icon>
      </button>

      <mat-menu #userMenu="matMenu">
        <div class="user-menu-header">
          <p class="user-menu-name">{{ authService.currentUser()?.firstName }} {{ authService.currentUser()?.lastName }}</p>
          <p class="user-menu-email">{{ authService.currentUser()?.email }}</p>
        </div>
        <mat-divider />
        <button mat-menu-item (click)="goToProfile()">
          <mat-icon>person</mat-icon>
          <span>Mon profil</span>
        </button>
        <button mat-menu-item (click)="goToSettings()">
          <mat-icon>settings</mat-icon>
          <span>Paramètres</span>
        </button>
        <mat-divider />
        <button mat-menu-item (click)="logout()">
          <mat-icon>logout</mat-icon>
          <span>Déconnexion</span>
        </button>
      </mat-menu>
    </mat-toolbar>
  `,
  styles: [`
    .toolbar {
      background-color: white;
      color: rgba(0, 0, 0, 0.87);
      border-bottom: 1px solid var(--mat-divider-color);
      position: sticky;
      top: 0;
      z-index: 10;
    }

    .menu-button {
      margin-right: 16px;
    }

    .toolbar-spacer {
      flex: 1;
    }

    .user-menu-header {
      padding: 16px;
      max-width: 250px;
    }

    .user-menu-name {
      margin: 0 0 4px;
      font-weight: 500;
      font-size: 16px;
    }

    .user-menu-email {
      margin: 0;
      font-size: 14px;
      color: rgba(0, 0, 0, 0.54);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    @media (min-width: 960px) {
      .menu-button {
        display: none;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToolbarComponent {
  readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly menuClick = output<void>();

  goToProfile(): void {
    this.router.navigate(['/app/profile']);
  }

  goToSettings(): void {
    this.router.navigate(['/app/settings']);
  }

  logout(): void {
    this.authService.logout();
  }
}
