export interface ProfileExperience {
  value: string;
  label: string;
}

export interface Profile {
  id: string;

  name: string;
  title: string;

  short_title?: string | null;
  tagline?: string | null;
  bio?: string | null;

  email?: string | null;
  phone?: string | null;
  location?: string | null;

  github_url?: string | null;
  linkedin_url?: string | null;
  cv_url?: string | null;

  profile_image_url?: string | null;

  experiences: ProfileExperience[];

  available_for_work: boolean;

  highlight?: string | null;

  created_at: string;
  updated_at: string;
}