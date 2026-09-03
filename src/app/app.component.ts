import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { NavbarComponent } from './layout/navbar/navbar.component';
import { FooterComponent } from './layout/footer/footer.component';
import { Profile } from './core/models/profile';
import { ProfileService } from './core/services/profile.services';

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
  private readonly profileService = inject(ProfileService);
  profile: Profile | null = null;
  ngOnInit(): void {
    void this.profileService.getProfile().then((profile) => {
      this.profile = profile;
    });
  }
}