import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';

import { ButtonModule } from 'primeng/button';

import { Profile } from '../../../../core/models/profile';

@Component({
  selector: 'app-hero',
  standalone: true,

  imports: [
    ButtonModule
  ],

  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss'
})
export class HeroComponent {

  @Input()
  profile: Profile | null = null;

  @Input()
  stats: {
    value: string;
    label: string;
  }[] = [];

  @Input()
  loading = false;

  @Input()
  error = false;


  @Output()
  retry = new EventEmitter<void>();

  @Output()
  navigate = new EventEmitter<string>();


  onRetry(): void {
    this.retry.emit();
  }


  onNavigate(section: string): void {
    this.navigate.emit(section);
  }

}