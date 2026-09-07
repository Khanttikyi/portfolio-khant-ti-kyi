import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Skill } from '../../../core/models/skill';
import { SkillService } from '../../../core/services/skill.services';

@Component({
  selector: 'app-admin-skills',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './skills.component.html',
  styleUrl: './skills.component.scss'
})
export class SkillsComponent implements OnInit {
  private readonly skillService = inject(SkillService);

  skills: Skill[] = [];

  loading = true;
  saving = false;

  errorMessage = '';
  successMessage = '';

  showForm = false;
  editingSkill: Skill | null = null;

  form: {
    category: string;
    name: string;
    icon: string;
    proficiency: number | null;
    years_experience: number | null;
    display_order: number;
    is_active: boolean;
  } = this.getEmptyForm();

  async ngOnInit(): Promise<void> {
    await this.loadSkills();
  }

  // ============================================================
  // LOAD
  // ============================================================

  async loadSkills(): Promise<void> {
    this.loading = true;
    this.errorMessage = '';

    try {
      this.skills = await this.skillService.getAllSkills();
    } catch (error) {
      console.error('Failed to load skills:', error);
      this.errorMessage = this.getErrorMessage(
        error,
        'Unable to load skills.'
      );
    } finally {
      this.loading = false;
    }
  }

  // ============================================================
  // CREATE
  // ============================================================

  openCreateForm(): void {
    this.editingSkill = null;
    this.form = this.getEmptyForm();

    this.errorMessage = '';
    this.successMessage = '';

    this.showForm = true;
  }

  // ============================================================
  // EDIT
  // ============================================================

  openEditForm(skill: Skill): void {
    this.editingSkill = skill;

    this.form = {
      category: skill.category ?? '',
      name: skill.name ?? '',
      icon: skill.icon ?? '',
      proficiency: skill.proficiency ?? null,
      years_experience: skill.years_experience ?? null,
      display_order: skill.display_order ?? 0,
      is_active: skill.is_active
    };

    this.errorMessage = '';
    this.successMessage = '';

    this.showForm = true;
  }

  // ============================================================
  // CLOSE FORM
  // ============================================================

  closeForm(): void {
    if (this.saving) {
      return;
    }

    this.showForm = false;
    this.editingSkill = null;
    this.form = this.getEmptyForm();

    this.errorMessage = '';
  }

  // ============================================================
  // SAVE
  // ============================================================

  async saveSkill(): Promise<void> {
    this.errorMessage = '';
    this.successMessage = '';

    const category = this.form.category.trim();
    const name = this.form.name.trim();
    const icon = this.form.icon.trim();

    if (!category) {
      this.errorMessage = 'Category is required.';
      return;
    }

    if (!name) {
      this.errorMessage = 'Skill name is required.';
      return;
    }

    if (
      this.form.proficiency !== null &&
      (
        this.form.proficiency < 0 ||
        this.form.proficiency > 100
      )
    ) {
      this.errorMessage =
        'Proficiency must be between 0 and 100.';
      return;
    }

    if (
      this.form.years_experience !== null &&
      this.form.years_experience < 0
    ) {
      this.errorMessage =
        'Years of experience cannot be negative.';
      return;
    }

    this.saving = true;

    const skillData = {
      category,
      name,
      icon: icon || null,
      proficiency: this.form.proficiency,
      years_experience: this.form.years_experience,
      display_order: Number(this.form.display_order) || 0,
      is_active: this.form.is_active
    };

    try {
      if (this.editingSkill?.id) {
        await this.skillService.updateSkill(
          this.editingSkill.id,
          skillData
        );

        this.successMessage =
          'Skill updated successfully.';
      } else {
        await this.skillService.createSkill(
          skillData
        );

        this.successMessage =
          'Skill created successfully.';
      }

      this.showForm = false;
      this.editingSkill = null;

      await this.loadSkills();

      setTimeout(() => {
        this.successMessage = '';
      }, 4000);
    } catch (error) {
      console.error('Failed to save skill:', error);

      this.errorMessage = this.getErrorMessage(
        error,
        'Unable to save skill.'
      );
    } finally {
      this.saving = false;
    }
  }

  // ============================================================
  // DELETE
  // ============================================================

  async deleteSkill(skill: Skill): Promise<void> {
    if (!skill.id) {
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${skill.name}"?`
    );

    if (!confirmed) {
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';

    try {
      await this.skillService.deleteSkill(skill.id);

      this.skills = this.skills.filter(
        item => item.id !== skill.id
      );

      this.successMessage =
        'Skill deleted successfully.';

      setTimeout(() => {
        this.successMessage = '';
      }, 4000);
    } catch (error) {
      console.error('Failed to delete skill:', error);

      this.errorMessage = this.getErrorMessage(
        error,
        'Unable to delete skill.'
      );
    }
  }

  // ============================================================
  // TOGGLE ACTIVE
  // ============================================================

  async toggleActive(skill: Skill): Promise<void> {
    if (!skill.id) {
      return;
    }

    const originalValue = skill.is_active;

    skill.is_active = !skill.is_active;

    try {
      await this.skillService.updateSkill(
        skill.id,
        {
          is_active: skill.is_active
        }
      );

      this.successMessage = skill.is_active
        ? `"${skill.name}" is now active.`
        : `"${skill.name}" is now inactive.`;

      setTimeout(() => {
        this.successMessage = '';
      }, 3000);
    } catch (error) {
      skill.is_active = originalValue;

      console.error(
        'Failed to update skill status:',
        error
      );

      this.errorMessage = this.getErrorMessage(
        error,
        'Unable to update skill status.'
      );
    }
  }

  // ============================================================
  // HELPERS
  // ============================================================

  get activeSkillsCount(): number {
    return this.skills.filter(
      skill => skill.is_active
    ).length;
  }

  get inactiveSkillsCount(): number {
    return this.skills.filter(
      skill => !skill.is_active
    ).length;
  }

  get categoriesCount(): number {
    return new Set(
      this.skills.map(skill => skill.category)
    ).size;
  }

  trackBySkill(
    index: number,
    skill: Skill
  ): string {
    return skill.id || `${index}-${skill.name}`;
  }

  private getEmptyForm() {
    return {
      category: '',
      name: '',
      icon: '',
      proficiency: null as number | null,
      years_experience: null as number | null,
      display_order: 0,
      is_active: true
    };
  }

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
        (error as { message: unknown }).message
      );
    }

    return fallback;
  }
}