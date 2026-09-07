import { Injectable, inject } from '@angular/core';

import { SupabaseService } from './supabase.services';

import { Experience } from '../models/experience';

@Injectable({
  providedIn: 'root'
})
export class ExperienceService {

  private readonly supabase =
    inject(SupabaseService);


  // =========================================================
  // PUBLIC - GET ACTIVE EXPERIENCE
  // =========================================================

  async getExperiences(): Promise<Experience[]> {

    const { data, error } =
      await this.supabase.client
        .from('experience')
        .select('*')
        .eq('is_active', true)
        .order('display_order')
        .order('start_date', {
          ascending: false
        });

    if (error) {

      console.error(
        'Error loading experience:',
        error
      );

      throw error;
    }

    return data ?? [];
  }


  // =========================================================
  // ADMIN - GET ALL EXPERIENCE
  // =========================================================

  async getAllExperiences(): Promise<Experience[]> {

    const { data, error } =
      await this.supabase.client
        .from('experience')
        .select('*')
        .order('display_order')
        .order('start_date', {
          ascending: false
        });

    if (error) {

      console.error(
        'Error loading all experience:',
        error
      );

      throw error;
    }

    return data ?? [];
  }


  // =========================================================
  // ADMIN - CREATE
  // =========================================================

  async createExperience(
    experience: Omit<
      Experience,
      'id' |
      'created_at' |
      'updated_at'
    >
  ): Promise<Experience> {

    const { data, error } =
      await this.supabase.client
        .from('experience')
        .insert({
          company: experience.company,
          role: experience.role,
          employment_type:
            experience.employment_type || null,
          start_date:
            experience.start_date,
          end_date:
            experience.is_current
              ? null
              : experience.end_date || null,
          is_current:
            experience.is_current,
          location:
            experience.location || null,
          description:
            experience.description || null,
          technologies:
            experience.technologies ?? [],
          company_url:
            experience.company_url || null,
          company_logo_url:
            experience.company_logo_url || null,
          display_order:
            Number(experience.display_order) || 0,
          is_active:
            experience.is_active
        })
        .select()
        .single();

    if (error) {

      console.error(
        'Error creating experience:',
        error
      );

      throw error;
    }

    return data;
  }


  // =========================================================
  // ADMIN - UPDATE
  // =========================================================

  async updateExperience(
    id: string,
    experience: Partial<Experience>
  ): Promise<Experience> {

    const updateData: Partial<Experience> = {
      ...experience,
      updated_at:
        new Date().toISOString()
    };

    if (experience.is_current === true) {
      updateData.end_date = null;
    }

    const { data, error } =
      await this.supabase.client
        .from('experience')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

    if (error) {

      console.error(
        'Error updating experience:',
        error
      );

      throw error;
    }

    return data;
  }


  // =========================================================
  // ADMIN - DELETE
  // =========================================================

  async deleteExperience(
    id: string
  ): Promise<void> {

    const { error } =
      await this.supabase.client
        .from('experience')
        .delete()
        .eq('id', id);

    if (error) {

      console.error(
        'Error deleting experience:',
        error
      );

      throw error;
    }
  }

}