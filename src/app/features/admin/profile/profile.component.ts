import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  Profile,
  ProfileExperience
} from '../../../core/models/profile';

import { ProfileService } from '../../../core/services/profile.services';

@Component({
  selector: 'app-admin-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {

  private readonly profileService = inject(ProfileService);

  profile: Profile | null = null;

  loading = true;
  saving = false;

  errorMessage = '';
  successMessage = '';

  newExperienceValue = '';
  newExperienceLabel = '';

  async ngOnInit(): Promise<void> {
    await this.loadProfile();
  }

  async loadProfile(): Promise<void> {
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    try {
      this.profile = await this.profileService.getProfile();

      if (!this.profile) {
        this.errorMessage = 'Profile information could not be found.';
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
      this.errorMessage = 'Unable to load profile information.';
    } finally {
      this.loading = false;
    }
  }

  async saveProfile(): Promise<void> {
    if (!this.profile?.id) {
      return;
    }

    this.saving = true;
    this.errorMessage = '';
    this.successMessage = '';

    try {
      const updatedProfile =
        await this.profileService.updateProfile(
          this.profile.id,
          {
            name: this.profile.name,
            title: this.profile.title,
            short_title: this.profile.short_title,
            tagline: this.profile.tagline,
            bio: this.profile.bio,
            email: this.profile.email,
            phone: this.profile.phone,
            location: this.profile.location,
            github_url: this.profile.github_url,
            linkedin_url: this.profile.linkedin_url,
            cv_url: this.profile.cv_url,
            profile_image_url: this.profile.profile_image_url,
            experiences: this.profile.experiences,
            available_for_work: this.profile.available_for_work,
            highlight: this.profile.highlight
          }
        );

      this.profile = updatedProfile;

      this.successMessage = 'Profile updated successfully.';

      setTimeout(() => {
        this.successMessage = '';
      }, 4000);

    } catch (error) {
      console.error('Failed to save profile:', error);

      this.errorMessage =
        this.getErrorMessage(error);
    } finally {
      this.saving = false;
    }
  }

  addExperience(): void {
    if (!this.profile) {
      return;
    }

    const label = this.newExperienceLabel.trim();
    const value = this.newExperienceValue.trim();

    if (!label || !value) {
      return;
    }

    if (!this.profile.experiences) {
      this.profile.experiences = [];
    }

    this.profile.experiences.push({
      label,
      value
    });

    this.newExperienceLabel = '';
    this.newExperienceValue = '';
  }

  removeExperience(index: number): void {
    if (!this.profile?.experiences) {
      return;
    }

    this.profile.experiences.splice(index, 1);
  }

  trackExperience(
    index: number,
    experience: ProfileExperience
  ): string {
    return `${index}-${experience.label}-${experience.value}`;
  }

  private getErrorMessage(error: unknown): string {
    if (
      error &&
      typeof error === 'object' &&
      'message' in error
    ) {
      return String(
        (error as { message: unknown }).message
      );
    }

    return 'Unable to save profile. Please try again.';
  }
}