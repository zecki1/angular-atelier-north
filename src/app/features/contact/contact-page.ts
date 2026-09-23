import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { SupabaseLeadsService } from '../../core/services/supabase-leads.service';
import { RevealDirective } from '../../shared/directives/reveal.directive';

type ContactStatus = 'idle' | 'sending' | 'success' | 'error';

@Component({
  selector: 'app-contact-page',
  standalone: true,
  imports: [ReactiveFormsModule, RevealDirective],
  templateUrl: './contact-page.html',
  styleUrl: './contact-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactPage {
  private readonly fb = inject(FormBuilder);
  private readonly leads = inject(SupabaseLeadsService);

  readonly status = signal<ContactStatus>('idle');
  readonly demo = signal(false);

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    message: ['', [Validators.required, Validators.minLength(10)]],
  });

  invalid(field: 'name' | 'email' | 'message'): boolean {
    const control = this.form.get(field);
    return Boolean(control && control.invalid && (control.touched || control.dirty));
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.status.set('sending');
    const { name, email, message } = this.form.getRawValue();

    this.leads.submit({ name, email, message }).subscribe({
      next: (result) => {
        this.demo.set(result.demo);
        this.status.set('success');
        this.form.reset();
      },
      error: () => this.status.set('error'),
    });
  }
}