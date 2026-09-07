import { Injectable, inject } from '@angular/core';

import { SupabaseService } from './supabase.services';

export interface ContactMessage {
  name: string;
  email: string;
  subject?: string | null;
  message: string;
}

export interface ContactMessageRecord {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
}

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  private readonly supabaseService =
    inject(SupabaseService);


  // =========================================================
  // PUBLIC CONTACT FORM
  // =========================================================

  async sendMessage(
    message: ContactMessage
  ): Promise<void> {

    const { error } =
      await this.supabaseService.client
        .from('contact_messages')
        .insert({
          name: message.name,
          email: message.email,
          subject: message.subject || null,
          message: message.message
        });

    if (error) {
      throw error;
    }
  }


  // =========================================================
  // ADMIN - GET ALL MESSAGES
  // =========================================================

  async getMessages(): Promise<ContactMessageRecord[]> {

    const { data, error } =
      await this.supabaseService.client
        .from('contact_messages')
        .select('*')
        .order('created_at', {
          ascending: false
        });

    if (error) {
      console.error(
        'Error loading contact messages:',
        error
      );

      throw error;
    }

    return data ?? [];
  }


  // =========================================================
  // ADMIN - MARK AS READ / UNREAD
  // =========================================================

  async updateReadStatus(
    id: string,
    isRead: boolean
  ): Promise<void> {

    const { error } =
      await this.supabaseService.client
        .from('contact_messages')
        .update({
          is_read: isRead
        })
        .eq('id', id);

    if (error) {
      console.error(
        'Error updating message status:',
        error
      );

      throw error;
    }
  }


  // =========================================================
  // ADMIN - DELETE MESSAGE
  // =========================================================

  async deleteMessage(
    id: string
  ): Promise<void> {

    const { error } =
      await this.supabaseService.client
        .from('contact_messages')
        .delete()
        .eq('id', id);

    if (error) {
      console.error(
        'Error deleting contact message:',
        error
      );

      throw error;
    }
  }

}