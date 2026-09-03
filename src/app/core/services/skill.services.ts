import { Injectable, inject } from '@angular/core';

import { SupabaseService } from './supabase.services';
import { Skill } from '../models/skill';

@Injectable({
  providedIn: 'root'
})
export class SkillService {

  private readonly supabase = inject(SupabaseService);

  async getSkills(): Promise<Skill[]> {

    const { data, error } = await this.supabase.client
      .from('skills')
      .select('*')
      .eq('is_active', true)
      .order('category')
      .order('display_order');

    if (error) {
      console.error('Error loading skills:', error);
      throw error;
    }

    return data ?? [];
  }
}