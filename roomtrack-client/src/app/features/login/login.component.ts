import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Home, LucideAngularModule, EyeOff, Eye } from 'lucide-angular';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../core/auth.service';
import { FormValidationService } from '../../core/form-validation.service';
import { AlertModalComponent } from '../alert-modal/alert-modal.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    LucideAngularModule,
    RouterLink,
    AlertModalComponent,
  ],
  providers: [AuthService, FormValidationService],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  loginForm!: FormGroup;
  showPassword = false;
  modalTitle = '';
  modalMessage = '';
  modalVisible = false;
  isModalSuccess = true;

  readonly EyeIcon = Eye;
  readonly EyeCloseIcon = EyeOff;
  readonly HomeIcon = Home;

  @Output() loginSuccess = new EventEmitter<string>();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private formValidationService: FormValidationService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    return this.formValidationService.isFieldInvalid(this.loginForm, fieldName);
  }

  validateErrorField(fieldName: string, rule: string): boolean {
    return this.formValidationService.validateErrorField(
      this.loginForm,
      fieldName,
      rule
    );
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.showErrorModal(
        'Form Validation',
        'Please fill in all fields correctly'
      );
      return;
    }

    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: (response) => {
        this.showSuccessModal(
          'Login Successful',
          'You will be redirected shortly'
        );
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 600);
      },
      error: (error) => {
        this.showErrorModal(
          'Login Failed',
          error.error.error.message || 'Invalid credentials'
        );
      },
    });
  }

  showSuccessModal(title: string, message: string) {
    this.modalTitle = title;
    this.modalMessage = message;
    this.isModalSuccess = true;
    this.modalVisible = true;
  }

  showErrorModal(title: string, message: string) {
    this.modalTitle = title;
    this.modalMessage = message;
    this.isModalSuccess = false;
    this.modalVisible = true;
  }

  closeModal() {
    this.modalVisible = false;
  }
}
