import { Component, output, inject, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '@core/auth/auth.service';

interface MenuItem {
  label: string;
  icon: string;
  route: string;
  roles?: string[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatListModule,
    MatIconModule,
    MatDividerModule
  ],
  template: `
    <div class="sidebar">
      <!-- Logo -->
      <div class="sidebar-header">
        <mat-icon class="logo-icon">fitness_center</mat-icon>
        <h2 class="logo-text">ClassHub</h2>
      </div>

      <mat-divider />

      <!-- Navigation Menu -->
      <mat-nav-list>
        @for (item of visibleMenuItems(); track item.route) {
          <a
            mat-list-item
            [routerLink]="item.route"
            routerLinkActive="active"
            (click)="menuItemClick.emit()"
          >
            <mat-icon matListItemIcon>{{ item.icon }}</mat-icon>
            <span matListItemTitle>{{ item.label }}</span>
          </a>
        }
      </mat-nav-list>

      <!-- User Info at bottom -->
      <div class="sidebar-footer">
        <mat-divider />
        <div class="user-info">
          <mat-icon>account_circle</mat-icon>
          <div class="user-details">
            <p class="user-name">{{ authService.currentUser()?.firstName }} {{ authService.currentUser()?.lastName }}</p>
            <p class="user-role">{{ getRoleLabel() }}</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .sidebar {
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    .sidebar-header {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 20px 16px;
    }

    .logo-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
      color: #3f51b5;
    }

    .logo-text {
      margin: 0;
      font-size: 20px;
      font-weight: 600;
      color: #3f51b5;
    }

    mat-nav-list {
      flex: 1;
      padding-top: 8px;
    }

    a.active {
      background-color: rgba(63, 81, 181, 0.08);
      color: #3f51b5;
    }

    .sidebar-footer {
      margin-top: auto;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px;
    }

    .user-details {
      flex: 1;
      overflow: hidden;
    }

    .user-name {
      margin: 0;
      font-size: 14px;
      font-weight: 500;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .user-role {
      margin: 0;
      font-size: 12px;
      color: rgba(0, 0, 0, 0.54);
      text-transform: capitalize;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarComponent {
  readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly menuItemClick = output<void>();

  private readonly allMenuItems: MenuItem[] = [
    { label: 'Tableau de bord', icon: 'dashboard', route: '/app/dashboard' },
    { label: 'Cours', icon: 'event', route: '/app/courses' },
    { label: 'Mes présences', icon: 'check_circle', route: '/app/attendances/history' },
    { label: 'Gestion des cours', icon: 'edit_calendar', route: '/app/courses/manage', roles: ['admin', 'coach'] },
    { label: 'Statistiques', icon: 'bar_chart', route: '/app/attendances/stats', roles: ['admin', 'coach'] },
    { label: 'Utilisateurs', icon: 'people', route: '/app/users', roles: ['admin'] },
    { label: 'Organisations', icon: 'business', route: '/app/organizations', roles: ['admin'] },
    { label: 'Paramètres', icon: 'settings', route: '/app/settings', roles: ['admin'] },
    { label: 'Logs d\'audit', icon: 'history', route: '/app/audit-logs', roles: ['admin'] }
  ];

  readonly visibleMenuItems = computed(() => {
    const user = this.authService.currentUser();
    if (!user) return [];

    return this.allMenuItems.filter(item => {
      if (!item.roles) return true;
      return item.roles.includes(user.role);
    });
  });

  getRoleLabel(): string {
    const role = this.authService.currentUser()?.role;
    switch (role) {
      case 'admin': return 'Administrateur';
      case 'coach': return 'Coach';
      case 'member': return 'Membre';
      default: return '';
    }
  }
}
