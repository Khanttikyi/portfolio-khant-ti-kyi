import { Injectable, inject } from '@angular/core';

import { SupabaseService } from './supabase.services';
import { Project } from '../models/project';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  private readonly supabase = inject(SupabaseService);

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
}