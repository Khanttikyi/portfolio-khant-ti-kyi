import { Component, inject, Input } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { ContactService } from '../../../../core/services/contact.services';
import { Profile } from '../../../../core/models/profile';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
  imports: [
    ReactiveFormsModule
  ]
})
export class ContactComponent {

  private readonly fb = inject(FormBuilder);
  private readonly contactService = inject(ContactService);
  @Input()
  profile: Profile | null = null;

  isSubmitting = false;
  isSuccess = false;
  errorMessage = '';

  contactForm = this.fb.group({
    name: [
      '',
      [Validators.required]
    ],

    email: [
      '',
      [
        Validators.required,
        Validators.email
      ]
    ],

    subject: [
      ''
    ],

    message: [
      '',
      [Validators.required]
    ],
  });


  async submitForm(): Promise<void> {

    this.isSuccess = false;
    this.errorMessage = '';

    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    try {

      await this.contactService.sendMessage({
        name: this.contactForm.value.name!,
        email: this.contactForm.value.email!,
        subject: this.contactForm.value.subject || null,
        message: this.contactForm.value.message!
      });

      this.isSuccess = true;

      this.contactForm.reset();

    } catch (error) {

      console.error(
        'Failed to send contact message:',
        error
      );

      this.errorMessage =
        'Unable to send your message. Please try again later.';

    } finally {

      this.isSubmitting = false;

    }
  }
}