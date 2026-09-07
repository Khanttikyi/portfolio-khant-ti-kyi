import { Routes } from '@angular/router';
import { authGuard } from './core/guard/auth.guard';

export const routes: Routes = [

  // =====================================================
  // PUBLIC PORTFOLIO
  // =====================================================

  {
    path: '',
    loadComponent: () =>
      import('./features/home/home.component').then(
        m => m.HomeComponent
      )
  },


  // =====================================================
  // ADMIN LOGIN
  // =====================================================

  {
    path: 'admin/login',
    loadComponent: () =>
      import('./features/admin/login/login.component').then(
        m => m.LoginComponent
      )
  },


  // =====================================================
  // ADMIN AREA
  // =====================================================

  {
    path: 'admin',
    canActivate: [authGuard],

    loadComponent: () =>
      import('./features/admin/admin-layout/admin-layout.component').then(
        m => m.AdminLayoutComponent
      ),

    children: [

      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard'
      },

      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/admin/dashboard/dashboard.component').then(
            m => m.DashboardComponent
          )
      },

      {
        path: 'profile',
        loadComponent: () =>
          import('./features/admin/profile/profile.component').then(
            m => m.ProfileComponent
          )
      },

      {
        path: 'skills',
        loadComponent: () =>
          import('./features/admin/skills/skills.component').then(
            m => m.SkillsComponent
          )
      },

      {
        path: 'experience',
        loadComponent: () =>
          import('./features/admin/experience/experience.component').then(
            m => m.ExperienceComponent
          )
      },

      {
        path: 'projects',
        loadComponent: () =>
          import('./features/admin/projects/projects.component').then(
            m => m.ProjectsComponent
          )
      },

      {
        path: 'education',
        loadComponent: () =>
          import('./features/admin/education/education.component').then(
            m => m.EducationComponent
          )
      },

      {
        path: 'messages',
        loadComponent: () =>
          import('./features/admin/messages/messages.component').then(
            m => m.MessagesComponent
          )
      }

    ]
  },


  // =====================================================
  // FALLBACK
  // =====================================================

  {
    path: '**',
    redirectTo: ''
  }

];