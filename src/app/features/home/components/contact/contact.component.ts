import {
  Component,
  Input
} from '@angular/core';

import { Profile } from '../../../../core/models/profile';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent {

  @Input() profile: Profile | null = null;
}