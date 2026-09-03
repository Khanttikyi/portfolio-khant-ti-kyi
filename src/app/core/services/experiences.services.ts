import { Injectable, inject } from '@angular/core';

import { SupabaseService } from './supabase.services';
import { Experience } from '../models/experience';

@Injectable({
  providedIn: 'root'
})
export class ExperienceService {

  private readonly supabase = inject(SupabaseService);

  async getExperiences(): Promise<Experience[]> {

    const { data, error } = await this.supabase.client
      .from('experience')
      .select('*')
      .eq('is_active', true)
      .order('display_order')
      .order('start_date', { ascending: false });

    if (error) {
      console.error('Error loading experience:', error);
      throw error;
    }

    return data ?? [];
  }
}