import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';

import { Profile } from '../../../../core/models/profile';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent {

  @Input() profile: Profile | null = null;
 
  @Output() navigate = new EventEmitter<string>();

  onNavigate(id: string): void {
    this.navigate.emit(id);
  }
}