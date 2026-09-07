import { Injectable, inject } from '@angular/core';

import { SupabaseService } from './supabase.services';
import { Profile } from '../models/profile';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private readonly supabase = inject(SupabaseService);

  // ============================================================
  // PUBLIC
  // ============================================================

  async getProfile(): Promise<Profile | null> {
    const { data, error } = await this.supabase.client
      .from('profile')
      .select('*')
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('Error loading profile:', error);
      throw error;
    }

    return data;
  }

  // ============================================================
  // ADMIN
  // ============================================================

  async updateProfile(
    id: string,
    profile: Partial<Profile>
  ): Promise<Profile> {
    const { data, error } = await this.supabase.client
      .from('profile')
      .update({
        ...profile,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
  
    if (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  
    return data;
  }
}