import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ProjectService } from '../../../core/services/projects.services';
import { Project } from '../../../core/models/project';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss'
})
export class ProjectsComponent implements OnInit {

  private readonly projectService = inject(ProjectService);

  projectList: Project[] = [];

  isLoading = false;
  isSaving = false;

  showForm = false;
  isEditing = false;

  editingId: string | null = null;

  errorMessage = '';
  successMessage = '';

  form: Project = this.createEmptyProject();

  ngOnInit(): void {
    this.loadProjects();
  }

  // ============================================================
  // LOAD PROJECTS
  // ============================================================

  async loadProjects(): Promise<void> {

    this.isLoading = true;
    this.errorMessage = '';

    try {

      this.projectList =
        await this.projectService.getAllProjects();

    } catch (error) {

      console.error('Error loading projects:', error);

      this.errorMessage =
        'Failed to load projects. Please try again.';

    } finally {

      this.isLoading = false;
    }
  }

  // ============================================================
  // EMPTY PROJECT
  // ============================================================

  private createEmptyProject(): Project {
    return {
      title: '',
      slug: '',
      icon: '',
      category: null,

      short_description: null,
      description: null,

      image_url: null,
      thumbnail_url: null,

      project_url: null,
      github_url: null,

      technologies: [],

      featured: false,
      display_order: 0,
      is_active: true
    };
  }

  // ============================================================
  // ADD
  // ============================================================

  openAddForm(): void {

    this.form = this.createEmptyProject();

    this.editingId = null;
    this.isEditing = false;

    this.errorMessage = '';
    this.successMessage = '';

    this.showForm = true;
  }

  // ============================================================
  // EDIT
  // ============================================================

  editProject(project: Project): void {

    this.form = {
      ...project,
      technologies: [...(project.technologies ?? [])]
    };

    this.editingId = project.id ?? null;
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

    this.form = this.createEmptyProject();
  }

  // ============================================================
  // SAVE
  // ============================================================

  async saveProject(): Promise<void> {

    if (!this.form.title.trim()) {

      this.errorMessage =
        'Project title is required.';

      return;
    }

    if (!this.form.slug.trim()) {

      this.errorMessage =
        'Project slug is required.';

      return;
    }

    this.isSaving = true;

    this.errorMessage = '';
    this.successMessage = '';

    try {

      const technologies = this.form.technologies
        .map(technology => technology.trim())
        .filter(Boolean);

      const payload = {

        title:
          this.form.title.trim(),

        slug:
          this.form.slug.trim(),

        icon:
          this.form.icon?.trim() || '',

        category:
          this.form.category?.trim() || null,

        short_description:
          this.form.short_description?.trim() || null,

        description:
          this.form.description?.trim() || null,

        image_url:
          this.form.image_url?.trim() || null,

        thumbnail_url:
          this.form.thumbnail_url?.trim() || null,

        project_url:
          this.form.project_url?.trim() || null,

        github_url:
          this.form.github_url?.trim() || null,

        technologies,

        featured:
          this.form.featured,

        display_order:
          Number(this.form.display_order) || 0,

        is_active:
          this.form.is_active
      };

      // UPDATE
      if (this.isEditing && this.editingId) {

        await this.projectService.updateProject(
          this.editingId,
          payload
        );

        this.successMessage =
          'Project updated successfully.';

      }

      // CREATE
      else {

        await this.projectService.createProject(
          payload
        );

        this.successMessage =
          'Project added successfully.';
      }

      await this.loadProjects();

      this.showForm = false;

      this.editingId = null;
      this.isEditing = false;

      this.form = this.createEmptyProject();

    } catch (error) {

      console.error('Error saving project:', error);

      this.errorMessage =
        'Failed to save project. Please try again.';

    } finally {

      this.isSaving = false;
    }
  }

  // ============================================================
  // DELETE
  // ============================================================

  async deleteProject(project: Project): Promise<void> {

    if (!project.id) {
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${project.title}"?`
    );

    if (!confirmed) {
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';

    try {

      await this.projectService.deleteProject(
        project.id
      );

      this.successMessage =
        'Project deleted successfully.';

      await this.loadProjects();

    } catch (error) {

      console.error('Error deleting project:', error);

      this.errorMessage =
        'Failed to delete project. Please try again.';
    }
  }

  // ============================================================
  // TOGGLE ACTIVE
  // ============================================================

  async toggleActive(project: Project): Promise<void> {

    if (!project.id) {
      return;
    }

    const newStatus = !project.is_active;

    try {

      await this.projectService.updateProject(
        project.id,
        {
          is_active: newStatus
        }
      );

      project.is_active = newStatus;

      this.successMessage = newStatus
        ? 'Project activated.'
        : 'Project deactivated.';

    } catch (error) {

      console.error(
        'Error updating project status:',
        error
      );

      this.errorMessage =
        'Failed to update project status.';
    }
  }

  // ============================================================
  // TOGGLE FEATURED
  // ============================================================

  async toggleFeatured(project: Project): Promise<void> {

    if (!project.id) {
      return;
    }

    const newStatus = !project.featured;

    try {

      await this.projectService.updateProject(
        project.id,
        {
          featured: newStatus
        }
      );

      project.featured = newStatus;

      this.successMessage = newStatus
        ? 'Project marked as featured.'
        : 'Project removed from featured.';

    } catch (error) {

      console.error(
        'Error updating featured status:',
        error
      );

      this.errorMessage =
        'Failed to update featured status.';
    }
  }

  // ============================================================
  // TECHNOLOGIES
  // ============================================================

  getTechnologyText(project: Project): string {
    return project.technologies?.join(', ') || '—';
  }

  // ============================================================
  // IMAGE ERROR
  // ============================================================

  handleImageError(event: Event): void {

    const image =
      event.target as HTMLImageElement;

    image.style.display = 'none';
  }

  // ============================================================
  // TRACK BY
  // ============================================================

  trackById(
    index: number,
    item: Project
  ): string | number {

    return item.id ?? index;
  }
  onTechnologiesChange(value: string): void {
    this.form.technologies = value
      .split(',')
      .map(item => item.trim())
      .filter(item => item !== '');
  }
}