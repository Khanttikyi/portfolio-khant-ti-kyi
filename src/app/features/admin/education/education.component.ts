import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { EducationService } from '../../../core/services/educations.services';
import { Education } from '../../../core/models/education';

@Component({
  selector: 'app-education',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './education.component.html',
  styleUrl: './education.component.scss'
})
export class EducationComponent implements OnInit {

  private readonly educationService = inject(EducationService);

  educationList: Education[] = [];

  isLoading = false;
  isSaving = false;

  showForm = false;
  isEditing = false;

  errorMessage = '';
  successMessage = '';

  editingId: string | null = null;

  form: Education = this.createEmptyEducation();

  ngOnInit(): void {
    this.loadEducation();
  }

  // ============================================================
  // LOAD
  // ============================================================

  async loadEducation(): Promise<void> {
    this.isLoading = true;
    this.errorMessage = '';

    try {
      this.educationList =
        await this.educationService.getAllEducation();

    } catch (error) {
      console.error('Error loading education:', error);

      this.errorMessage =
        'Failed to load education records.';
    } finally {
      this.isLoading = false;
    }
  }

  // ============================================================
  // CREATE EMPTY FORM
  // ============================================================

  private createEmptyEducation(): Education {
    return {
      institution: '',
      degree: null,
      field_of_study: null,
      start_date: null,
      end_date: null,
      description: null,
      institution_url: null,
      logo_url: null,
      display_order: 0,
      is_active: true
    };
  }

  // ============================================================
  // OPEN ADD FORM
  // ============================================================

  openAddForm(): void {
    this.form = this.createEmptyEducation();

    this.editingId = null;
    this.isEditing = false;

    this.errorMessage = '';
    this.successMessage = '';

    this.showForm = true;
  }

  // ============================================================
  // OPEN EDIT FORM
  // ============================================================

  editEducation(education: Education): void {
    this.form = {
      ...education
    };

    this.editingId = education.id ?? null;
    this.isEditing = true;

    this.errorMessage = '';
    this.successMessage = '';

    this.showForm = true;
  }

  // ============================================================
  // CLOSE FORM
  // ============================================================

  closeForm(): void {
    if (this.isSaving) {
      return;
    }

    this.showForm = false;
    this.editingId = null;
    this.isEditing = false;

    this.form = this.createEmptyEducation();
  }

  // ============================================================
  // SAVE
  // ============================================================

  async saveEducation(): Promise<void> {

    if (!this.form.institution.trim()) {
      this.errorMessage = 'Institution name is required.';
      return;
    }

    this.isSaving = true;
    this.errorMessage = '';
    this.successMessage = '';

    try {

      const payload = {
        institution: this.form.institution.trim(),

        degree: this.form.degree?.trim() || null,

        field_of_study:
          this.form.field_of_study?.trim() || null,

        start_date:
          this.form.start_date || null,

        end_date:
          this.form.end_date || null,

        description:
          this.form.description?.trim() || null,

        institution_url:
          this.form.institution_url?.trim() || null,

        logo_url:
          this.form.logo_url?.trim() || null,

        display_order:
          Number(this.form.display_order) || 0,

        is_active:
          this.form.is_active
      };

      if (this.isEditing && this.editingId) {

        await this.educationService.updateEducation(
          this.editingId,
          payload
        );

        this.successMessage =
          'Education updated successfully.';

      } else {

        await this.educationService.createEducation(
          payload
        );

        this.successMessage =
          'Education added successfully.';
      }

      await this.loadEducation();

      this.showForm = false;
      this.editingId = null;
      this.isEditing = false;

      this.form = this.createEmptyEducation();

    } catch (error) {

      console.error('Error saving education:', error);

      this.errorMessage =
        'Failed to save education. Please try again.';

    } finally {
      this.isSaving = false;
    }
  }

  // ============================================================
  // DELETE
  // ============================================================

  async deleteEducation(education: Education): Promise<void> {

    if (!education.id) {
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${education.institution}"?`
    );

    if (!confirmed) {
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';

    try {

      await this.educationService.deleteEducation(
        education.id
      );

      this.successMessage =
        'Education deleted successfully.';

      await this.loadEducation();

    } catch (error) {

      console.error('Error deleting education:', error);

      this.errorMessage =
        'Failed to delete education. Please try again.';
    }
  }

  // ============================================================
  // TOGGLE ACTIVE
  // ============================================================

  async toggleActive(education: Education): Promise<void> {

    if (!education.id) {
      return;
    }

    const newStatus = !education.is_active;

    try {

      await this.educationService.updateEducation(
        education.id,
        {
          is_active: newStatus
        }
      );

      education.is_active = newStatus;

      this.successMessage = newStatus
        ? 'Education activated.'
        : 'Education deactivated.';

    } catch (error) {

      console.error(
        'Error updating education status:',
        error
      );

      this.errorMessage =
        'Failed to update education status.';
    }
  }

  // ============================================================
  // DATE FORMAT
  // ============================================================

  formatDate(date: string | null): string {

    if (!date) {
      return '—';
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString(
      'en-US',
      {
        month: 'short',
        year: 'numeric'
      }
    );
  }

  // ============================================================
  // TRACK BY
  // ============================================================

  trackById(
    index: number,
    item: Education
  ): string | number {
    return item.id ?? index;
  }
}