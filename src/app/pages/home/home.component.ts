import {
  Component,
  OnInit,
  inject
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

import { Profile } from '../../core/models/profile';
import { Skill } from '../../core/models/skill';
import { Experience } from '../../core/models/experience';
import { Project } from '../../core/models/project';
import { Education } from '../../core/models/education';

import { ProfileService } from '../../core/services/profile.services';
import { SkillService } from '../../core/services/skill.services';
import { ExperienceService } from '../../core/services/experiences.services';
import { ProjectService } from '../../core/services/projects.services';
import { EducationService } from '../../core/services/educations.services';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  // =====================================================
  // SERVICES
  // =====================================================

  private readonly profileService =
    inject(ProfileService);

  private readonly skillService =
    inject(SkillService);

  private readonly experienceService =
    inject(ExperienceService);

  private readonly projectService =
    inject(ProjectService);

  private readonly educationService =
    inject(EducationService);


  // =====================================================
  // DATA
  // =====================================================

  profile: Profile | null = null;

  skills: Skill[] = [];

  experiences: Experience[] = [];

  projects: Project[] = [];

  education: Education[] = [];


  // =====================================================
  // STATE
  // =====================================================

  loading = true;

  error = false;


  // =====================================================
  // STATS
  // =====================================================

  readonly stats = [
    {
      value: '7+',
      label: 'Years Experience'
    },
    {
      value: '6+',
      label: 'Years Angular'
    },
    {
      value: '20+',
      label: 'Projects'
    }
  ];


  // =====================================================
  // INIT
  // =====================================================

  ngOnInit(): void {
    void this.loadHomeData();
  }


  // =====================================================
  // LOAD HOME DATA
  // =====================================================

  async loadHomeData(): Promise<void> {

    this.loading = true;
    this.error = false;

    try {

      const [
        profile,
        skills,
        experiences,
        projects,
        education
      ] = await Promise.all([

        this.profileService.getProfile(),

        this.skillService.getSkills(),

        this.experienceService.getExperiences(),

        this.projectService.getProjects(),

        this.educationService.getEducations()

      ]);


      this.profile = profile;

      this.skills = skills;

      this.experiences = experiences;

      this.projects = projects;

      this.education = education;

    } catch (error) {

      console.error(
        'Failed to load homepage data:',
        error
      );

      this.error = true;

    } finally {

      this.loading = false;

    }
  }


  // =====================================================
  // RETRY
  // =====================================================

  async loadProfile(): Promise<void> {
    await this.loadHomeData();
  }


  // =====================================================
  // SCROLL
  // =====================================================

  scrollTo(id: string): void {

    document
      .getElementById(id)
      ?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });

  }


  // =====================================================
  // PROJECT NUMBER
  // =====================================================

  formatProjectNumber(index: number): string {

    return (index + 1)
      .toString()
      .padStart(2, '0');

  }

}