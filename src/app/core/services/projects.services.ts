import { Injectable, inject } from '@angular/core';

import { SupabaseService } from './supabase.services';
import { Project } from '../models/project';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  private readonly supabase = inject(SupabaseService);

  // ============================================================
  // PUBLIC
  // ============================================================

  async getProjects(): Promise<Project[]> {
    const { data, error } = await this.supabase.client
      .from('projects')
      .select('*')
      .eq('is_active', true)
      .order('display_order');

    if (error) {
      console.error('Error loading projects:', error);
      throw error;
    }

    return data ?? [];
  }

  async getFeaturedProjects(): Promise<Project[]> {
    const { data, error } = await this.supabase.client
      .from('projects')
      .select('*')
      .eq('is_active', true)
      .eq('featured', true)
      .order('display_order');

    if (error) {
      console.error('Error loading featured projects:', error);
      throw error;
    }

    return data ?? [];
  }

  async getProjectBySlug(
    slug: string
  ): Promise<Project | null> {
    const { data, error } = await this.supabase.client
      .from('projects')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .maybeSingle();

    if (error) {
      console.error('Error loading project:', error);
      throw error;
    }

    return data;
  }

  // ============================================================
  // ADMIN
  // ============================================================

  async getAllProjects(): Promise<Project[]> {
    const { data, error } = await this.supabase.client
      .from('projects')
      .select('*')
      .order('display_order');

    if (error) {
      console.error('Error loading all projects:', error);
      throw error;
    }

    return data ?? [];
  }

  async createProject(
    project: Omit<Project, 'id' | 'created_at' | 'updated_at'>
  ): Promise<Project> {

    const { data, error } = await this.supabase.client
      .from('projects')
      .insert(project)
      .select()
      .single();

    if (error) {
      console.error('Error creating project:', error);
      throw error;
    }

    return data;
  }

  async updateProject(
    id: string,
    project: Partial<Project>
  ): Promise<Project> {

    const { data, error } = await this.supabase.client
      .from('projects')
      .update({
        ...project,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating project:', error);
      throw error;
    }

    return data;
  }

  async deleteProject(id: string): Promise<void> {
    const { error } = await this.supabase.client
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting project:', error);
      throw error;
    }
  }
}