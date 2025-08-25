import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SupabaseService } from '../../../../services/supabase.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  imports: [ReactiveFormsModule],
  styles: `
   
  `,
  templateUrl: './loginPage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPageComponent {

  private readonly fb = inject(FormBuilder);
  private readonly supabase = inject(SupabaseService);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);

  public readonly loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(4)]]
  });

  fillAsGuest(): void {
    this.loginForm.setValue({
      email: 'guest@guest.com',
      password: 'guest123'
    });
  }

  readonly errorMsg = signal<string | null>(null);
  
  onSubmit(): void {
    if (this.loginForm.valid) {
      this.supabase.login(this.loginForm.value.email, this.loginForm.value.password).subscribe(
        (response) => {
          if (response.error) this.errorMsg.set(response.error.message);
          else {
            // Retrieve returnUrl from query params or default to '/productos'
            const returnUrl = this.activatedRoute.snapshot.queryParams['returnUrl'] || '/productos';
            this.router.navigate([returnUrl]);
          }
        }
      );
    }
  }
}
