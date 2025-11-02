import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `
    <div class="app-container">
      <header class="app-header">
        <h1>ClassHub</h1>
        <p class="text-secondary">Gestion de Cours et Présences</p>
      </header>
      <main class="app-main">
        <router-outlet />
        <div class="welcome-message">
          <h2>Configuration initiale terminée ✓</h2>
          <ul class="setup-checklist">
            <li>✓ Angular 20 avec standalone components</li>
            <li>✓ Design System avec tokens SCSS</li>
            <li>✓ Angular Material configuré</li>
            <li>✓ Client API généré depuis Swagger</li>
            <li>✓ AuthService avec signals</li>
            <li>✓ Guards et intercepteurs HTTP</li>
          </ul>
          <p class="text-muted mt-4">
            Prochaines étapes : Créer les composants auth, dashboard, etc.
          </p>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .app-header {
      background: linear-gradient(135deg, #3f51b5 0%, #5c6bc0 100%);
      color: white;
      padding: 2rem;
      text-align: center;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

      h1 {
        margin: 0;
        font-size: 2.5rem;
        font-weight: 700;
      }

      p {
        margin: 0.5rem 0 0;
        font-size: 1.1rem;
        opacity: 0.9;
      }
    }

    .app-main {
      flex: 1;
      padding: 2rem;
      max-width: 800px;
      margin: 0 auto;
      width: 100%;
    }

    .welcome-message {
      background: white;
      border-radius: 12px;
      padding: 2rem;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);

      h2 {
        color: #3f51b5;
        margin-bottom: 1.5rem;
      }
    }

    .setup-checklist {
      list-style: none;
      padding: 0;

      li {
        padding: 0.75rem 0;
        border-bottom: 1px solid #e0e0e0;
        font-size: 1.1rem;

        &:last-child {
          border-bottom: none;
        }
      }
    }
  `]
})
export class AppComponent {
  title = 'ClassHub';
}
