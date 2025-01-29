import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  imports: [CommonModule, ReactiveFormsModule],
  styles: `
   
  `,
  templateUrl: './loginPage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPageComponent {

  private fb = inject(FormBuilder);


  public loginForm: FormGroup = this.fb.group({
    number: ['', Validators.required],
    password: ['', Validators.required]
  });
}
