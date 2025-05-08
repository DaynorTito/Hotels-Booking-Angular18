import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Eye, EyeOff, Home, LucideAngularModule } from 'lucide-angular';

import { AuthService } from '../../core/auth.service';
import { FormValidationService } from '../../core/form-validation.service';
import { AlertModalComponent } from '../alert-modal/alert-modal.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    LucideAngularModule,
    RouterLink,
    AlertModalComponent
],
  providers: [AuthService, FormValidationService],
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  registerForm!: FormGroup;
  email = '';
  password = '';
  role = 'admin';
  name = '';
  showPassword = false;
  modalTitle = '';
  modalMessage = '';
  modalVisible = false;
  isModalSuccess = true;
  readonly EyeIcon = Eye;
  readonly EyeCloseIcon = EyeOff;
  readonly HomeIcon = Home;

  @Output() formSubmitted = new EventEmitter<string>();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private formValidationService: FormValidationService
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.pattern(/^(?=.*[A-Z])(?=.*\d).*$/),
        ],
      ],
      role: ['admin'],
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    return this.formValidationService.isFieldInvalid(
      this.registerForm,
      fieldName
    );
  }

  validateErrorField(fieldName: string, rule: string): boolean {
    return this.formValidationService.validateErrorField(
      this.registerForm,
      fieldName,
      rule
    );
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      this.showErrorModal(
        'Form Validation',
        'Please complete all fields correctly'
      );
      return;
    }

    const { name, email, password } = this.registerForm.value;

    this.authService.register(name, email, password).subscribe({
      next: (response) => {
        this.showSuccessModal(
          'Registration Successful',
          'You will be redirected to login'
        );
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 700);
      },
      error: (error) => {
        this.showErrorModal(
          'Registration Failed',
          error.error.error.message || 'Unable to register'
        );
      },
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
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
