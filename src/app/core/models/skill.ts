export interface Skill {
  id: string;
  category: string;
  name: string;
  icon?: string | null;
  proficiency?: number | null;
  years_experience?: number | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}