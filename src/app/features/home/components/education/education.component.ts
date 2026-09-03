import {
  Component,
  Input
} from '@angular/core';

import { Education } from '../../../../core/models/education';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-education',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './education.component.html',
  styleUrl: './education.component.scss'
})
export class EducationComponent {

  @Input() education: Education[] = [];

  @Input() loading = false;

  @Input() error = false;
}