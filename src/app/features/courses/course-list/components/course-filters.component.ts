import { Component, output, signal, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { CourseFilters, CourseStatus } from '@app/shared/models/course.model';

@Component({
  selector: 'app-course-filters',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <form [formGroup]="filterForm" class="filters-container">
      <div class="filters-row">
        <!-- Date de début -->
        <mat-form-field appearance="outline">
          <mat-label>Date de début</mat-label>
          <input
            matInput
            [matDatepicker]="startPicker"
            formControlName="startDate"
            placeholder="JJ/MM/AAAA"
          />
          <mat-datepicker-toggle matIconSuffix [for]="startPicker"></mat-datepicker-toggle>
          <mat-datepicker #startPicker></mat-datepicker>
        </mat-form-field>

        <!-- Date de fin -->
        <mat-form-field appearance="outline">
          <mat-label>Date de fin</mat-label>
          <input
            matInput
            [matDatepicker]="endPicker"
            formControlName="endDate"
            placeholder="JJ/MM/AAAA"
          />
          <mat-datepicker-toggle matIconSuffix [for]="endPicker"></mat-datepicker-toggle>
          <mat-datepicker #endPicker></mat-datepicker>
        </mat-form-field>

        <!-- Type de cours -->
        <mat-form-field appearance="outline">
          <mat-label>Type de cours</mat-label>
          <mat-select formControlName="courseType">
            <mat-option [value]="null">Tous les types</mat-option>
            <mat-option value="krav-maga">Krav Maga</mat-option>
            <mat-option value="yoga">Yoga</mat-option>
            <mat-option value="fitness">Fitness</mat-option>
            <mat-option value="boxe">Boxe</mat-option>
            <mat-option value="danse">Danse</mat-option>
          </mat-select>
        </mat-form-field>

        <!-- Statut -->
        <mat-form-field appearance="outline">
          <mat-label>Statut</mat-label>
          <mat-select formControlName="status">
            <mat-option [value]="null">Tous les statuts</mat-option>
            <mat-option value="scheduled">Planifié</mat-option>
            <mat-option value="ongoing">En cours</mat-option>
            <mat-option value="completed">Terminé</mat-option>
            <mat-option value="cancelled">Annulé</mat-option>
          </mat-select>
        </mat-form-field>

        <!-- Boutons d'action -->
        <div class="filter-actions">
          <button mat-raised-button color="primary" (click)="applyFilters()" type="button">
            <mat-icon>search</mat-icon>
            Rechercher
          </button>
          <button mat-button (click)="resetFilters()" type="button">
            <mat-icon>clear</mat-icon>
            Réinitialiser
          </button>
        </div>
      </div>
    </form>
  `,
  styles: [
    `
      .filters-container {
        padding: 1rem;
        background-color: #f5f5f5;
        border-radius: 8px;
        margin-bottom: 1.5rem;
      }

      .filters-row {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
        align-items: flex-start;
      }

      mat-form-field {
        flex: 1;
        min-width: 200px;
      }

      .filter-actions {
        display: flex;
        gap: 0.5rem;
        align-items: center;
        padding-top: 0.5rem;
      }

      .filter-actions button {
        white-space: nowrap;
      }

      @media (max-width: 768px) {
        .filters-row {
          flex-direction: column;
        }

        mat-form-field {
          width: 100%;
        }

        .filter-actions {
          width: 100%;
          flex-direction: column;
        }

        .filter-actions button {
          width: 100%;
        }
      }
    `,
  ],
})
export class CourseFiltersComponent {
  // Output pour émettre les filtres
  filtersChange = output<CourseFilters>();

  // FormGroup pour les filtres
  filterForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      startDate: [null],
      endDate: [null],
      courseType: [null],
      status: [null],
    });
  }

  /**
   * Appliquer les filtres
   */
  applyFilters(): void {
    const filters: CourseFilters = {
      startDate: this.filterForm.value.startDate || undefined,
      endDate: this.filterForm.value.endDate || undefined,
      courseType: this.filterForm.value.courseType || undefined,
      status: this.filterForm.value.status || undefined,
    };
    this.filtersChange.emit(filters);
  }

  /**
   * Réinitialiser les filtres
   */
  resetFilters(): void {
    this.filterForm.reset({
      startDate: null,
      endDate: null,
      courseType: null,
      status: null,
    });
    this.filtersChange.emit({});
  }
}
