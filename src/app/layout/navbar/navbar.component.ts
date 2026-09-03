
import { Component, inject, Input } from '@angular/core';
import { ButtonModule } from 'primeng/button';

import { ThemeService } from '../../core/services/theme.services';
import { Profile } from '../../core/models/profile';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [ButtonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {

  private readonly themeService = inject(ThemeService);

  @Input()
  profile: Profile | null = null;
  readonly theme = this.themeService.theme;

  menuOpen = false;

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu(): void {
    this.menuOpen = false;
  }

  toggleTheme(): void {
    this.themeService.toggle();
  }
}

