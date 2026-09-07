import { Injectable, inject } from '@angular/core';

import { SupabaseService } from './supabase.services';
import { Education } from '../models/education';

@Injectable({
  providedIn: 'root'
})
export class EducationService {

  private readonly supabase = inject(SupabaseService);

  // ============================================================
  // PUBLIC
  // ============================================================

  async getEducations(): Promise<Education[]> {

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

  // ============================================================
  // ADMIN
  // ============================================================

  async getAllEducation(): Promise<Education[]> {

    const { data, error } = await this.supabase.client
      .from('education')
      .select('*')
      .order('display_order')
      .order('start_date', { ascending: false });

    if (error) {
      console.error('Error loading all education:', error);
      throw error;
    }

    return data ?? [];
  }

  async createEducation(
    education: Omit<Education, 'id' | 'created_at' | 'updated_at'>
  ): Promise<Education> {

    const { data, error } = await this.supabase.client
      .from('education')
      .insert(education)
      .select()
      .single();

    if (error) {
      console.error('Error creating education:', error);
      throw error;
    }

    return data;
  }

  async updateEducation(
    id: string,
    education: Partial<Education>
  ): Promise<Education> {

    const { data, error } = await this.supabase.client
      .from('education')
      .update({
        ...education,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating education:', error);
      throw error;
    }

    return data;
  }

  async deleteEducation(id: string): Promise<void> {

    const { error } = await this.supabase.client
      .from('education')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting education:', error);
      throw error;
    }
  }
}