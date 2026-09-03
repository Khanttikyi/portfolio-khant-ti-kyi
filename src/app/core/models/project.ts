export interface Project {
  id?: string;
  title: string;
  slug: string;
  icon:string;
  category: string | null;
  short_description: string | null;
  description: string | null;
  image_url: string | null;
  thumbnail_url: string | null;
  project_url: string | null;
  github_url: string | null;
  technologies: string[];
  featured: boolean;
  display_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}