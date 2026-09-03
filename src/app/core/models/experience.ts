export interface Experience {
  id: string;

  company: string;

  role: string;

  employment_type?: string | null;

  start_date: string;

  end_date?: string | null;

  is_current: boolean;

  location?: string | null;

  description?: string | null;

  technologies: string[];

  company_url?: string | null;

  company_logo_url?: string | null;

  display_order: number;

  is_active: boolean;

  created_at: string;

  updated_at: string;

  /**
   * Display period used by the existing HTML.
   *
   * Example:
   * "2019 – Present"
   * "Jan 2019 – Sep 2019"
   */
  period?: string | null;
}