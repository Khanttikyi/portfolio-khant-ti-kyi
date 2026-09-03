import {
    Component,
    OnInit,
    inject
  } from '@angular/core';
  
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
  
  import { HeroComponent } from './components/hero/hero.component';
  import { AboutComponent } from './components/about/about.component';
  import { SkillsComponent } from './components/skills/skills.component';
  import { ExperienceComponent } from './components/experience/experience.component';
  import { ProjectsComponent } from './components/projects/projects.component';
  import { EducationComponent } from './components/education/education.component';
  import { ContactComponent } from './components/contact/contact.component';
  
  @Component({
    selector: 'app-home',
    standalone: true,
    imports: [
      HeroComponent,
      AboutComponent,
      SkillsComponent,
      ExperienceComponent,
      ProjectsComponent,
      EducationComponent,
      ContactComponent
    ],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss'
  })
  export class HomeComponent implements OnInit {
  
    private readonly profileService = inject(ProfileService);
    private readonly skillService = inject(SkillService);
    private readonly experienceService = inject(ExperienceService);
    private readonly projectService = inject(ProjectService);
    private readonly educationService = inject(EducationService);
  
    profile: Profile | null = null;
  
    skills: Skill[] = [];
  
    experiences: Experience[] = [];
  
    projects: Project[] = [];
  
    education: Education[] = [];
  
    loading = true;
  
    error = false;
  

  
    ngOnInit(): void {
      void this.loadHomeData();
    }
  
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
          this.educationService.getEducation()
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
  
    retryLoad(): void {
      void this.loadHomeData();
    }
  
    scrollTo(id: string): void {
  
      document
        .getElementById(id)
        ?.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
  
    }
  }