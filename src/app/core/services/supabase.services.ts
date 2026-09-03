import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

import { environment } from '../../../environment/environment.development';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {

  readonly client: SupabaseClient;

  constructor() {
    this.client = createClient(
      environment.supabase.url,
      environment.supabase.anonKey
    );
  }
}