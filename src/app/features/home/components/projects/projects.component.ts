import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';

import { Project } from '../../../../core/models/project';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss'
})
export class ProjectsComponent {

  @Input() projects: Project[] = [];

  @Input() loading = false;

  @Input() error = false;

  @Output() navigate = new EventEmitter<string>();

  formatProjectNumber(index: number): string {
    return (index + 1)
      .toString()
      .padStart(2, '0');
  }

  onNavigate(id: string): void {
    this.navigate.emit(id);
  }
  getDescriptionLines(project: Project): string[] {
    const description =
      project.description ||
      project.short_description ||
      '';
  
    return description
      .split('.')
      .map(sentence => sentence.trim())
      .filter(sentence => sentence.length > 0)
      .map(sentence => `${sentence}.`);
  }
  
  getProjectIcon(project: Project): string {
    const title = project.title.toLowerCase();
  
    if (title.includes('insurance')) {
      return 'pi pi-shield';
    }
  
    if (
      title.includes('microfinance') ||
      title.includes('bnk')
    ) {
      return 'pi pi-wallet';
    }
  
    if (title.includes('coca')) {
      return 'pi pi-mobile';
    }
  
    if (title.includes('danone')) {
      return 'pi pi-box';
    }
  
    return 'pi pi-code';
  }
}