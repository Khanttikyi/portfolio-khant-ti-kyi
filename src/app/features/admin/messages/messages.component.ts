import {
  Component,
  OnInit,
  inject
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  ContactService,
  ContactMessageRecord
} from '../../../core/services/contact.services';

@Component({
  selector: 'app-admin-messages',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.scss'
})
export class MessagesComponent implements OnInit {

  private readonly contactService =
    inject(ContactService);


  // =========================================================
  // DATA
  // =========================================================

  messages: ContactMessageRecord[] = [];

  selectedMessage: ContactMessageRecord | null = null;


  // =========================================================
  // UI STATE
  // =========================================================

  loading = true;

  processing = false;

  errorMessage = '';

  successMessage = '';


  // =========================================================
  // SEARCH / FILTER
  // =========================================================

  searchTerm = '';

  filter: 'all' | 'unread' | 'read' = 'all';


  // =========================================================
  // INIT
  // =========================================================

  async ngOnInit(): Promise<void> {
    await this.loadMessages();
  }


  // =========================================================
  // LOAD
  // =========================================================

  async loadMessages(): Promise<void> {

    this.loading = true;

    this.errorMessage = '';

    try {

      this.messages =
        await this.contactService.getMessages();

    } catch (error) {

      console.error(
        'Failed to load messages:',
        error
      );

      this.errorMessage =
        this.getErrorMessage(
          error,
          'Unable to load messages.'
        );

    } finally {

      this.loading = false;

    }
  }


  // =========================================================
  // FILTERED MESSAGES
  // =========================================================

  get filteredMessages(): ContactMessageRecord[] {

    let result = [...this.messages];


    // -------------------------------------------------------
    // READ FILTER
    // -------------------------------------------------------

    if (this.filter === 'unread') {

      result = result.filter(
        message => !message.is_read
      );

    } else if (this.filter === 'read') {

      result = result.filter(
        message => message.is_read
      );

    }


    // -------------------------------------------------------
    // SEARCH
    // -------------------------------------------------------

    const search =
      this.searchTerm
        .trim()
        .toLowerCase();

    if (!search) {
      return result;
    }

    return result.filter(message => {

      return (
        message.name
          ?.toLowerCase()
          .includes(search) ||

        message.email
          ?.toLowerCase()
          .includes(search) ||

        message.subject
          ?.toLowerCase()
          .includes(search) ||

        message.message
          ?.toLowerCase()
          .includes(search)
      );

    });
  }


  // =========================================================
  // STATISTICS
  // =========================================================

  get totalMessages(): number {
    return this.messages.length;
  }


  get unreadMessages(): number {

    return this.messages.filter(
      message => !message.is_read
    ).length;

  }


  get readMessages(): number {

    return this.messages.filter(
      message => message.is_read
    ).length;

  }


  // =========================================================
  // OPEN MESSAGE
  // =========================================================

  async openMessage(
    message: ContactMessageRecord
  ): Promise<void> {

    this.selectedMessage = message;

    this.errorMessage = '';

    // Automatically mark unread message as read.
    if (!message.is_read) {

      await this.markAsRead(message);

    }
  }


  // =========================================================
  // CLOSE MESSAGE
  // =========================================================

  closeMessage(): void {

    if (this.processing) {
      return;
    }

    this.selectedMessage = null;

  }


  // =========================================================
  // MARK AS READ
  // =========================================================

  async markAsRead(
    message: ContactMessageRecord
  ): Promise<void> {

    if (message.is_read) {
      return;
    }

    const originalValue =
      message.is_read;

    message.is_read = true;

    try {

      await this.contactService
        .updateReadStatus(
          message.id,
          true
        );

      if (
        this.selectedMessage?.id === message.id
      ) {

        this.selectedMessage = {
          ...this.selectedMessage,
          is_read: true
        };

      }

    } catch (error) {

      message.is_read = originalValue;

      console.error(
        'Failed to mark message as read:',
        error
      );

      this.errorMessage =
        this.getErrorMessage(
          error,
          'Unable to mark message as read.'
        );

    }
  }


  // =========================================================
  // MARK AS UNREAD
  // =========================================================

  async markAsUnread(
    message: ContactMessageRecord
  ): Promise<void> {

    const originalValue =
      message.is_read;

    message.is_read = false;

    try {

      await this.contactService
        .updateReadStatus(
          message.id,
          false
        );

      if (
        this.selectedMessage?.id === message.id
      ) {

        this.selectedMessage = {
          ...this.selectedMessage,
          is_read: false
        };

      }

      this.successMessage =
        'Message marked as unread.';

      this.clearSuccessMessage();

    } catch (error) {

      message.is_read = originalValue;

      console.error(
        'Failed to mark message as unread:',
        error
      );

      this.errorMessage =
        this.getErrorMessage(
          error,
          'Unable to mark message as unread.'
        );
    }
  }


  // =========================================================
  // TOGGLE READ STATUS
  // =========================================================

  async toggleReadStatus(
    message: ContactMessageRecord
  ): Promise<void> {

    if (message.is_read) {

      await this.markAsUnread(message);

    } else {

      await this.markAsRead(message);

    }
  }


  // =========================================================
  // DELETE MESSAGE
  // =========================================================

  async deleteMessage(
    message: ContactMessageRecord
  ): Promise<void> {

    const confirmed =
      window.confirm(
        `Are you sure you want to delete the message from "${message.name}"?`
      );

    if (!confirmed) {
      return;
    }


    this.processing = true;

    this.errorMessage = '';

    this.successMessage = '';


    try {

      await this.contactService
        .deleteMessage(message.id);


      this.messages =
        this.messages.filter(
          item => item.id !== message.id
        );


      if (
        this.selectedMessage?.id === message.id
      ) {

        this.selectedMessage = null;

      }


      this.successMessage =
        'Message deleted successfully.';

      this.clearSuccessMessage();


    } catch (error) {

      console.error(
        'Failed to delete message:',
        error
      );

      this.errorMessage =
        this.getErrorMessage(
          error,
          'Unable to delete message.'
        );

    } finally {

      this.processing = false;

    }
  }


  // =========================================================
  // FILTER
  // =========================================================

  setFilter(
    filter: 'all' | 'unread' | 'read'
  ): void {

    this.filter = filter;

  }


  // =========================================================
  // CLEAR SEARCH
  // =========================================================

  clearSearch(): void {

    this.searchTerm = '';

  }


  // =========================================================
  // DATE
  // =========================================================

  formatDate(
    date: string
  ): string {

    return new Intl.DateTimeFormat(
      'en-US',
      {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }
    ).format(
      new Date(date)
    );

  }


  formatTime(
    date: string
  ): string {

    return new Intl.DateTimeFormat(
      'en-US',
      {
        hour: 'numeric',
        minute: '2-digit'
      }
    ).format(
      new Date(date)
    );

  }


  formatDateTime(
    date: string
  ): string {

    return new Intl.DateTimeFormat(
      'en-US',
      {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
      }
    ).format(
      new Date(date)
    );

  }


  // =========================================================
  // MESSAGE PREVIEW
  // =========================================================

  getMessagePreview(
    message: ContactMessageRecord
  ): string {

    const text =
      message.message
        ?.replace(/\s+/g, ' ')
        .trim() || '';

    if (text.length <= 100) {
      return text;
    }

    return `${text.substring(0, 100)}...`;

  }


  // =========================================================
  // TRACK
  // =========================================================

  trackByMessage(
    index: number,
    message: ContactMessageRecord
  ): string {

    return message.id ||
      `${index}-${message.email}`;

  }


  // =========================================================
  // SUCCESS MESSAGE
  // =========================================================

  private clearSuccessMessage(): void {

    setTimeout(() => {

      this.successMessage = '';

    }, 3500);

  }


  // =========================================================
  // ERROR MESSAGE
  // =========================================================

  private getErrorMessage(
    error: unknown,
    fallback: string
  ): string {

    if (
      error &&
      typeof error === 'object' &&
      'message' in error
    ) {

      return String(
        (error as {
          message: unknown
        }).message
      );

    }

    return fallback;

  }

}