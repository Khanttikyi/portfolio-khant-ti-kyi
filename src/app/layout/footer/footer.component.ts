import { Component, Input } from '@angular/core';
import { Profile } from '../../core/models/profile';

@Component({
  selector: 'app-footer',
  standalone: true,
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  @Input()
  profile: Profile | null = null;

  readonly currentYear = new Date().getFullYear();
}