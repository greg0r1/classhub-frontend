import { Component, signal, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { AuthService } from '@core/auth/auth.service';
import { SidebarComponent } from './components/sidebar.component';
import { ToolbarComponent } from './components/toolbar.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    SidebarComponent,
    ToolbarComponent
  ],
  template: `
    <mat-sidenav-container class="layout-container">
      <!-- Sidebar -->
      <mat-sidenav
        #sidenav
        [mode]="isMobile() ? 'over' : 'side'"
        [opened]="!isMobile()"
        class="layout-sidenav"
      >
        <app-sidebar (menuItemClick)="isMobile() && sidenav.close()" />
      </mat-sidenav>

      <!-- Main content -->
      <mat-sidenav-content class="layout-content">
        <!-- Toolbar -->
        <app-toolbar (menuClick)="sidenav.toggle()" />

        <!-- Page content -->
        <main class="main-content">
          <router-outlet />
        </main>

        <!-- Footer -->
        <footer class="layout-footer">
          <p>ClassHub v1.0.0 - © {{ currentYear }} - Tous droits réservés</p>
        </footer>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .layout-container {
      height: 100vh;
      display: flex;
    }

    .layout-sidenav {
      width: 240px;
      border-right: 1px solid var(--mat-divider-color);
    }

    .layout-content {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }

    .main-content {
      flex: 1;
      padding: 24px;
      background-color: #fafafa;
    }

    .layout-footer {
      padding: 16px 24px;
      text-align: center;
      background-color: white;
      border-top: 1px solid var(--mat-divider-color);
      color: rgba(0, 0, 0, 0.54);
      font-size: 14px;
    }

    @media (max-width: 959px) {
      .main-content {
        padding: 16px;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainLayoutComponent {
  private readonly authService = inject(AuthService);

  readonly isMobile = signal(window.innerWidth < 960);
  readonly currentYear = new Date().getFullYear();

  constructor() {
    // Listen to window resize
    window.addEventListener('resize', () => {
      this.isMobile.set(window.innerWidth < 960);
    });
  }
}
