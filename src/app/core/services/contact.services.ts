import { Injectable, inject } from '@angular/core';
import { SupabaseService } from './supabase.services';

export interface ContactMessage {
  name: string;
  email: string;
  subject?: string | null;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  private readonly supabaseService =
    inject(SupabaseService);

  async sendMessage(
    message: ContactMessage
  ) {

    const { data, error } =
      await this.supabaseService.client
      .from('contact_messages')
      .insert({
        name: message.name,
        email: message.email,
        subject: message.subject || null,
        message: message.message
      })

    if (error) {
      throw error;
    }

    return data;
  }
}