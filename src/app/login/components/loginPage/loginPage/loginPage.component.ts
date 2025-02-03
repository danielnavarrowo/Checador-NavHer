import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SupabaseService } from '../../../../services/supabase.service';
import { Router } from '@angular/router';

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

  public loginForm: FormGroup = this.fb.group({
    email: ['', Validators.required],
    password: ['', Validators.required]
  });
  errorMsg: string | null = null;

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.supabase.login(this.loginForm.value.email, this.loginForm.value.password).subscribe(
        (response) => {
          if (response.error) {
            this.errorMsg = response.error.message;
            console.error('Error logging in:', response.error.message);
          } else {
            this.errorMsg = null;
            this.router.navigate(['/checador']);
          }
        }
      );
    }
  }
}
