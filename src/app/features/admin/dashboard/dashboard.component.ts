import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from '../../../core/services/supabase.services';
import { AuthService } from '../../../core/services/auth.service';

interface DashboardStats {
  profile: number;
  skills: number;
  experience: number;
  projects: number;
  education: number;
  messages: number;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {

  loading = true;

  stats: DashboardStats = {
    profile: 0,
    skills: 0,
    experience: 0,
    projects: 0,
    education: 0,
    messages: 0
  };

  errorMessage = '';

  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    await this.loadDashboard();
  }

  get userEmail(): string {
    return this.authService.currentUser?.email ?? '';
  }

  async loadDashboard(): Promise<void> {
    this.loading = true;
    this.errorMessage = '';

    try {
      const client = this.supabaseService.client;

      const [
        profileResult,
        skillsResult,
        experienceResult,
        projectsResult,
        educationResult,
        messagesResult
      ] = await Promise.all([
        client
          .from('profile')
          .select('*', { count: 'exact', head: true }),

        client
          .from('skills')
          .select('*', { count: 'exact', head: true }),

        client
          .from('experience')
          .select('*', { count: 'exact', head: true }),

        client
          .from('projects')
          .select('*', { count: 'exact', head: true }),

        client
          .from('education')
          .select('*', { count: 'exact', head: true }),

        client
          .from('contact_messages')
          .select('*', { count: 'exact', head: true })
      ]);

      const errors = [
        profileResult.error,
        skillsResult.error,
        experienceResult.error,
        projectsResult.error,
        educationResult.error,
        messagesResult.error
      ].filter(Boolean);

      if (errors.length > 0) {
        console.error('Dashboard loading errors:', errors);

        this.errorMessage =
          'Some dashboard data could not be loaded.';
      }

      this.stats = {
        profile: profileResult.count ?? 0,
        skills: skillsResult.count ?? 0,
        experience: experienceResult.count ?? 0,
        projects: projectsResult.count ?? 0,
        education: educationResult.count ?? 0,
        messages: messagesResult.count ?? 0
      };

    } catch (error) {

      console.error(
        'Failed to load dashboard:',
        error
      );

      this.errorMessage =
        'Unable to load dashboard data.';

    } finally {
      this.loading = false;
    }
  }

  async logout(): Promise<void> {
    await this.authService.logout();

    await this.router.navigate(['/admin/login']);
  }
}