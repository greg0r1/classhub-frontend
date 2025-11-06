import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '@core/auth/auth.service';

@Component({
  selector: 'app-dashboard',
  imports: [MatButtonModule, MatIconModule],
  template: `
    <div class="dashboard">
      <h1>Tableau de bord</h1>
      <p>Bienvenue, {{ authService.userFullName() }} !</p>
      <p>Rôle : {{ authService.currentUser()?.role }}</p>

      <button mat-raised-button color="primary" (click)="authService.logout()">
        <mat-icon>logout</mat-icon>
        Se déconnecter
      </button>
    </div>
  `,
  styles: [
    `
      .dashboard {
        padding: 2rem;
        text-align: center;

        h1 {
          margin-bottom: 1rem;
        }

        p {
          margin-bottom: 0.5rem;
        }

        button {
          margin-top: 2rem;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  readonly authService = inject(AuthService);
}
