import {
  Component,
  Input,
  OnChanges,
  SimpleChanges
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { Experience } from '../../../../core/models/experience';

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './experience.component.html',
  styleUrl: './experience.component.scss'
})
export class ExperienceComponent implements OnChanges {

  @Input() experiences: Experience[] = [];
  @Input() loading = false;
  @Input() error = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['experiences']) {
      this.sortExperiences();
    }
  }

  /**
   * Sort experience by display order.
   */
  private sortExperiences(): void {
    this.experiences = [...this.experiences]
      .filter(experience => experience.is_active)
      .sort(
        (a, b) =>
          a.display_order - b.display_order
      );
  }

  /**
   * Format experience period.
   *
   * Example:
   * Jan 2019 – Present
   * Jan 2019 – Sep 2019
   */
  getPeriod(experience: Experience): string {
    const start = this.formatDate(experience.start_date);

    if (experience.is_current || !experience.end_date) {
      return `${start} – Present`;
    }

    const end = this.formatDate(experience.end_date);

    return `${start} – ${end}`;
  }

  /**
   * Format date as:
   * Jan 2019
   */
  private formatDate(date: string): string {
    if (!date) {
      return '';
    }

    const parsedDate = new Date(date);

    return parsedDate.toLocaleDateString(
      'en-US',
      {
        month: 'short',
        year: 'numeric'
      }
    );
  }

  /**
   * Split description into paragraphs.
   *
   * Database can contain:
   *
   * Paragraph 1
   *
   * Paragraph 2
   */
  getDescriptionParagraphs(
    description?: string | null
  ): string[] {

    if (!description) {
      return [];
    }

    return description
      .split(/\n\s*\n/)
      .map(text => text.trim())
      .filter(Boolean);
  }
}