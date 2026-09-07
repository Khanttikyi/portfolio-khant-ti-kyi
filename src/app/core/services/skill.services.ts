import { Injectable, inject } from '@angular/core';
import { SupabaseService } from './supabase.services';
import { Skill } from '../models/skill';

@Injectable({
  providedIn: 'root'
})
export class SkillService {
  private readonly supabase = inject(SupabaseService);

  // ============================================================
  // PUBLIC
  // ============================================================

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

  // ============================================================
  // ADMIN
  // ============================================================

  async getAllSkills(): Promise<Skill[]> {
    const { data, error } = await this.supabase.client
      .from('skills')
      .select('*')
      .order('category')
      .order('display_order');

    if (error) {
      console.error('Error loading all skills:', error);
      throw error;
    }

    return data ?? [];
  }

  async createSkill(
    skill: Omit<Skill, 'id' | 'created_at' | 'updated_at'>
  ): Promise<Skill> {
    const { data, error } = await this.supabase.client
      .from('skills')
      .insert({
        category: skill.category,
        name: skill.name,
        icon: skill.icon,
        proficiency: skill.proficiency,
        years_experience: skill.years_experience,
        display_order: skill.display_order,
        is_active: skill.is_active
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating skill:', error);
      throw error;
    }

    return data;
  }

  async updateSkill(
    id: string,
    skill: Partial<Skill>
  ): Promise<Skill> {
    const { data, error } = await this.supabase.client
      .from('skills')
      .update({
        category: skill.category,
        name: skill.name,
        icon: skill.icon,
        proficiency: skill.proficiency,
        years_experience: skill.years_experience,
        display_order: skill.display_order,
        is_active: skill.is_active,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating skill:', error);
      throw error;
    }

    return data;
  }

  async deleteSkill(id: string): Promise<void> {
    const { error } = await this.supabase.client
      .from('skills')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting skill:', error);
      throw error;
    }
  }
}