import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

interface MenuItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.scss'
})
export class AdminLayoutComponent {

  sidebarOpen = false;

  menuItems: MenuItem[] = [
    {
      label: 'Dashboard',
      icon: 'dashboard',
      route: '/admin/dashboard'
    },
    {
      label: 'Profile',
      icon: 'person',
      route: '/admin/profile'
    },
    {
      label: 'Skills',
      icon: 'code',
      route: '/admin/skills'
    },
    {
      label: 'Experience',
      icon: 'work',
      route: '/admin/experience'
    },
    {
      label: 'Projects',
      icon: 'folder',
      route: '/admin/projects'
    },
    {
      label: 'Education',
      icon: 'school',
      route: '/admin/education'
    },
    {
      label: 'Messages',
      icon: 'mail',
      route: '/admin/messages'
    }
  ];

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  get userEmail(): string {
    return this.authService.currentUser?.email ?? 'Administrator';
  }

  get userInitial(): string {
    return this.userEmail.charAt(0).toUpperCase();
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  closeSidebar(): void {
    this.sidebarOpen = false;
  }

  async logout(): Promise<void> {
    await this.authService.logout();
    await this.router.navigate(['/admin/login']);
  }

  openPortfolio(): void {
    this.router.navigate(['/']);
  }
}