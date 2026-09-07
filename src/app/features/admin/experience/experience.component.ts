import {
  Component,
  OnInit,
  inject
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Experience } from '../../../core/models/experience';

import {
  ExperienceService
} from '../../../core/services/experiences.services';

@Component({
  selector: 'app-admin-experience',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './experience.component.html',
  styleUrl: './experience.component.scss'
})
export class ExperienceComponent implements OnInit {

  private readonly experienceService =
    inject(ExperienceService);


  // =========================================================
  // DATA
  // =========================================================

  experiences: Experience[] = [];

  editingExperience:
    Experience | null = null;


  // =========================================================
  // UI
  // =========================================================

  loading = true;

  saving = false;

  showForm = false;

  errorMessage = '';

  successMessage = '';


  // =========================================================
  // FORM
  // =========================================================

  form = this.getEmptyForm();


  // =========================================================
  // INIT
  // =========================================================

  async ngOnInit(): Promise<void> {

    await this.loadExperiences();

  }


  // =========================================================
  // LOAD
  // =========================================================

  async loadExperiences(): Promise<void> {

    this.loading = true;

    this.errorMessage = '';

    try {

      this.experiences =
        await this.experienceService
          .getAllExperiences();

    } catch (error) {

      console.error(
        'Failed to load experience:',
        error
      );

      this.errorMessage =
        this.getErrorMessage(
          error,
          'Unable to load experience.'
        );

    } finally {

      this.loading = false;

    }
  }


  // =========================================================
  // CREATE
  // =========================================================

  openCreateForm(): void {

    this.editingExperience = null;

    this.form =
      this.getEmptyForm();

    this.errorMessage = '';

    this.successMessage = '';

    this.showForm = true;

  }


  // =========================================================
  // EDIT
  // =========================================================

  openEditForm(
    experience: Experience
  ): void {

    this.editingExperience =
      experience;

    this.form = {

      company:
        experience.company ?? '',

      role:
        experience.role ?? '',

      employment_type:
        experience.employment_type ?? '',

      start_date:
        this.toDateInput(
          experience.start_date
        ),

      end_date:
        this.toDateInput(
          experience.end_date
        ),

      is_current:
        experience.is_current,

      location:
        experience.location ?? '',

      description:
        experience.description ?? '',

      technologies:
        experience.technologies?.join(', ') ?? '',

      company_url:
        experience.company_url ?? '',

      company_logo_url:
        experience.company_logo_url ?? '',

      display_order:
        experience.display_order ?? 0,

      is_active:
        experience.is_active

    };

    this.errorMessage = '';

    this.successMessage = '';

    this.showForm = true;

  }


  // =========================================================
  // CLOSE
  // =========================================================

  closeForm(): void {

    if (this.saving) {
      return;
    }

    this.showForm = false;

    this.editingExperience = null;

    this.form =
      this.getEmptyForm();

    this.errorMessage = '';

  }


  // =========================================================
  // SAVE
  // =========================================================

  async saveExperience(): Promise<void> {

    this.errorMessage = '';

    this.successMessage = '';


    const company =
      this.form.company.trim();

    const role =
      this.form.role.trim();

    const startDate =
      this.form.start_date.trim();


    if (!company) {

      this.errorMessage =
        'Company is required.';

      return;

    }


    if (!role) {

      this.errorMessage =
        'Role is required.';

      return;

    }


    if (!startDate) {

      this.errorMessage =
        'Start date is required.';

      return;

    }


    if (
      !this.form.is_current &&
      !this.form.end_date
    ) {

      this.errorMessage =
        'End date is required for a previous position.';

      return;

    }


    this.saving = true;


    const technologies =
      this.form.technologies
        .split(',')
        .map(item => item.trim())
        .filter(Boolean);


    const experienceData = {

      company,

      role,

      employment_type:
        this.form.employment_type.trim() ||
        null,

      start_date:
        startDate,

      end_date:
        this.form.is_current
          ? null
          : this.form.end_date || null,

      is_current:
        this.form.is_current,

      location:
        this.form.location.trim() ||
        null,

      description:
        this.form.description.trim() ||
        null,

      technologies,

      company_url:
        this.form.company_url.trim() ||
        null,

      company_logo_url:
        this.form.company_logo_url.trim() ||
        null,

      display_order:
        Number(this.form.display_order) || 0,

      is_active:
        this.form.is_active

    };


    try {

      if (this.editingExperience?.id) {

        await this.experienceService
          .updateExperience(
            this.editingExperience.id,
            experienceData
          );

        this.successMessage =
          'Experience updated successfully.';

      } else {

        await this.experienceService
          .createExperience(
            experienceData
          );

        this.successMessage =
          'Experience created successfully.';

      }


      this.showForm = false;

      this.editingExperience = null;

      await this.loadExperiences();

      this.clearSuccessMessage();


    } catch (error) {

      console.error(
        'Failed to save experience:',
        error
      );

      this.errorMessage =
        this.getErrorMessage(
          error,
          'Unable to save experience.'
        );

    } finally {

      this.saving = false;

    }
  }


  // =========================================================
  // DELETE
  // =========================================================

  async deleteExperience(
    experience: Experience
  ): Promise<void> {

    if (!experience.id) {
      return;
    }


    const confirmed =
      window.confirm(
        `Are you sure you want to delete "${experience.role} at ${experience.company}"?`
      );


    if (!confirmed) {
      return;
    }


    this.errorMessage = '';

    this.successMessage = '';


    try {

      await this.experienceService
        .deleteExperience(
          experience.id
        );


      this.experiences =
        this.experiences.filter(
          item =>
            item.id !== experience.id
        );


      this.successMessage =
        'Experience deleted successfully.';

      this.clearSuccessMessage();


    } catch (error) {

      console.error(
        'Failed to delete experience:',
        error
      );

      this.errorMessage =
        this.getErrorMessage(
          error,
          'Unable to delete experience.'
        );

    }
  }


  // =========================================================
  // TOGGLE ACTIVE
  // =========================================================

  async toggleActive(
    experience: Experience
  ): Promise<void> {

    if (!experience.id) {
      return;
    }


    const originalValue =
      experience.is_active;


    experience.is_active =
      !experience.is_active;


    try {

      await this.experienceService
        .updateExperience(
          experience.id,
          {
            is_active:
              experience.is_active
          }
        );


      this.successMessage =
        experience.is_active
          ? `"${experience.role}" is now active.`
          : `"${experience.role}" is now inactive.`;

      this.clearSuccessMessage();


    } catch (error) {

      experience.is_active =
        originalValue;


      console.error(
        'Failed to update experience status:',
        error
      );

      this.errorMessage =
        this.getErrorMessage(
          error,
          'Unable to update experience status.'
        );
    }
  }


  // =========================================================
  // TECHNOLOGIES
  // =========================================================

  getTechnologies(
    experience: Experience
  ): string[] {

    return experience.technologies ?? [];

  }


  // =========================================================
  // DATE
  // =========================================================

  formatDate(
    date: string | null | undefined
  ): string {

    if (!date) {
      return '';
    }

    const parsed =
      new Date(date);

    if (Number.isNaN(parsed.getTime())) {
      return date;
    }

    return new Intl.DateTimeFormat(
      'en-US',
      {
        month: 'short',
        year: 'numeric'
      }
    ).format(parsed);

  }


  private toDateInput(
    date: string | null | undefined
  ): string {

    if (!date) {
      return '';
    }

    return date.substring(0, 10);

  }


  // =========================================================
  // STATS
  // =========================================================

  get activeExperiencesCount(): number {

    return this.experiences.filter(
      item => item.is_active
    ).length;

  }


  get inactiveExperiencesCount(): number {

    return this.experiences.filter(
      item => !item.is_active
    ).length;

  }


  get currentExperienceCount(): number {

    return this.experiences.filter(
      item => item.is_current
    ).length;

  }


  // =========================================================
  // TRACK
  // =========================================================

  trackByExperience(
    index: number,
    experience: Experience
  ): string {

    return experience.id ||
      `${index}-${experience.company}`;

  }


  // =========================================================
  // EMPTY FORM
  // =========================================================

  private getEmptyForm() {

    return {

      company: '',

      role: '',

      employment_type: '',

      start_date: '',

      end_date: '',

      is_current: false,

      location: '',

      description: '',

      technologies: '',

      company_url: '',

      company_logo_url: '',

      display_order: 0,

      is_active: true

    };

  }


  // =========================================================
  // SUCCESS
  // =========================================================

  private clearSuccessMessage(): void {

    setTimeout(() => {

      this.successMessage = '';

    }, 3500);

  }


  // =========================================================
  // ERROR
  // =========================================================

  private getErrorMessage(
    error: unknown,
    fallback: string
  ): string {

    if (
      error &&
      typeof error === 'object' &&
      'message' in error
    ) {

      return String(
        (error as {
          message: unknown
        }).message
      );

    }

    return fallback;

  }

}