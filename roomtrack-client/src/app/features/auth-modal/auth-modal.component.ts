import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth-modal',
  standalone: true,
  imports: [],
  templateUrl: './auth-modal.component.html',
  styleUrl: './auth-modal.component.scss',
})
export class AuthModalComponent {

  @Input() showAuthModal = false;
  @Output() close = new EventEmitter<void>();

  constructor(private router: Router) {}

  navigateToLogin(): void {
    this.router.navigate(['/login']);
    this.closeModal();
  }

  closeModal(): void {
    this.close.emit();
  }
}
