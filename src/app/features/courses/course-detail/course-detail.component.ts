import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="course-detail-container">
      <h1>Détail du cours</h1>
      <p>Ce composant sera implémenté dans un prochain US.</p>
    </div>
  `,
  styles: [
    `
      .course-detail-container {
        padding: 2rem;
      }
    `,
  ],
})
export class CourseDetailComponent {}
