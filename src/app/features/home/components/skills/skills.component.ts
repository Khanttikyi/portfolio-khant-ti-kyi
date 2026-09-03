import {
  Component,
  Input,
  OnChanges,
  SimpleChanges
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { Skill } from '../../../../core/models/skill';

interface SkillGroup {
  category: string;
  skills: Skill[];
}

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './skills.component.html',
  styleUrl: './skills.component.scss'
})
export class SkillsComponent implements OnChanges {

  @Input() skills: Skill[] = [];
  @Input() loading = false;
  @Input() error = false;

  groupedSkills: SkillGroup[] = [];


  private readonly categoryOrder: string[] = [
    'Frontend',
    'Angular Development',
    'Architecture',
    'Methodology',
    'Backend',
    'DevOps',
    'Testing',
    'UI/UX',
    'Languages'
  ];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['skills']) {
      this.groupSkills();
    }
  }


  private groupSkills(): void {

    const groups = new Map<string, Skill[]>();

    // Group skills by category
    for (const skill of this.skills) {

      if (!skill.is_active) {
        continue;
      }

      if (!groups.has(skill.category)) {
        groups.set(skill.category, []);
      }

      groups.get(skill.category)!.push(skill);
    }

    // Convert Map to array
    this.groupedSkills = Array.from(groups.entries())
      .map(([category, skills]) => {

        // Sort skills inside category
        const sortedSkills = [...skills].sort(
          (a, b) => a.display_order - b.display_order
        );

        return {
          category,
          skills: sortedSkills
        };
      })

      // Sort categories
      .sort((a, b) => {

        const indexA = this.categoryOrder.indexOf(a.category);
        const indexB = this.categoryOrder.indexOf(b.category);

        const orderA = indexA === -1 ? 999 : indexA;
        const orderB = indexB === -1 ? 999 : indexB;

        return orderA - orderB;
      });
  }
}