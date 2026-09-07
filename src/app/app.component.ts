import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { NavbarComponent } from './layout/navbar/navbar.component';
import { FooterComponent } from './layout/footer/footer.component';
import { Profile } from './core/models/profile';
import { ProfileService } from './core/services/profile.services';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NavbarComponent,
    FooterComponent
  ],
  templateUrl: './app.component.html'
})
export class AppComponent {
  isAdminRoute = false;

  constructor(
    private readonly router: Router
  ) {
    this.isAdminRoute = this.router.url.startsWith('/admin');

    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd)
      )
      .subscribe(event => {
        const navigation = event as NavigationEnd;

        this.isAdminRoute =
          navigation.urlAfterRedirects.startsWith('/admin');
      });
  }
  private readonly profileService = inject(ProfileService);
  profile: Profile | null = null;
  ngOnInit(): void {
    void this.profileService.getProfile().then((profile) => {
      this.profile = profile;
    });
  }
}