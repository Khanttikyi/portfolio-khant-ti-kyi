import { Injectable, inject } from '@angular/core';

import { SupabaseService } from './supabase.services';
import { Education } from '../models/education';

@Injectable({
  providedIn: 'root'
})
export class EducationService {

  private readonly supabase = inject(SupabaseService);

  async getEducation(): Promise<Education[]> {

    const { data, error } = await this.supabase.client
      .from('education')
      .select('*')
      .eq('is_active', true)
      .order('display_order')
      .order('start_date', { ascending: false });

    if (error) {
      console.error('Error loading education:', error);
      throw error;
    }

    return data ?? [];
  }
}