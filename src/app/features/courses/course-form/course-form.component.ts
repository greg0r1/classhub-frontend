import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-course-form',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="course-form-container">
      <h1>Créer / Modifier un cours</h1>
      <p>Ce composant sera implémenté dans un prochain US.</p>
    </div>
  `,
  styles: [
    `
      .course-form-container {
        padding: 2rem;
      }
    `,
  ],
})
export class CourseFormComponent {}
