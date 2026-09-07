import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  email = '';
  password = '';

  loading = false;
  errorMessage = '';

  showPassword = false;

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  async login(): Promise<void> {

    if (!this.email || !this.password) {
      this.errorMessage = 'Please enter your email and password.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const result = await this.authService.login(
      this.email.trim(),
      this.password
    );

    this.loading = false;

    if (result.error) {
      this.errorMessage = result.error;
      return;
    }

    await this.router.navigate(['/admin']);
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }
}