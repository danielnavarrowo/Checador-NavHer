import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, inject, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SupabaseService } from '../../../../services/supabase.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  imports: [CommonModule, ReactiveFormsModule],
  styles: `
   
  `,
  templateUrl: './loginPage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPageComponent {


  private fb = inject(FormBuilder);
  private supabase = inject(SupabaseService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);


  public loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(4)]]
  });

  fillAsGuest() {
    this.loginForm.setValue({
      email: 'guest@guest.com',
      password: 'guest123'
    });
  }

  errorMsg = signal<string | null>(null);
  
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
