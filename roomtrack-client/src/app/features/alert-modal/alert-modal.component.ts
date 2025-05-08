import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  ElementRef,
  HostListener,
} from '@angular/core';

@Component({
  selector: 'app-alert-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      *ngIf="isVisible"
      class="modal-overlay"
      (click)="onOverlayClick($event)"
    >
      <div
        class="modal-container"
        [ngClass]="{
          'success-modal': isSuccess,
          'error-modal': !isSuccess
        }"
        (click)="$event.stopPropagation()"
      >
        <button (click)="closeModal()" class="modal-close-btn">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div class="modal-content">
          <div class="modal-icon">
            <svg
              *ngIf="isSuccess"
              class="success-icon"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clip-rule="evenodd"
              />
            </svg>
            <svg
              *ngIf="!isSuccess"
              class="error-icon"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clip-rule="evenodd"
              />
            </svg>
          </div>

          <div class="modal-text">
            <p class="modal-title">{{ title }}</p>
            <p class="modal-message">{{ message }}</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .modal-overlay {
        @apply fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50
             transition-opacity duration-300 ease-in-out;
      }

      .modal-container {
        @apply relative w-96 max-w-md p-6 rounded-lg shadow-2xl
             transform transition-all duration-300 ease-in-out
             scale-95 opacity-0 translate-y-4
             animate-modal-show;
      }

      .success-modal {
        @apply bg-green-50 border-2 border-green-200 text-green-800;
      }

      .error-modal {
        @apply bg-red-50 border-2 border-red-200 text-red-800;
      }

      .modal-close-btn {
        @apply absolute top-3 right-3 text-gray-500 hover:text-gray-700
             focus:outline-none focus:ring-2 focus:ring-green-300
             rounded-full p-1 transition-colors;
      }

      .modal-content {
        @apply flex items-center space-x-4;
      }

      .modal-icon {
        @apply flex-shrink-0;
      }

      .success-icon {
        @apply w-8 h-8 text-green-500;
      }

      .error-icon {
        @apply w-8 h-8 text-red-500;
      }

      .modal-text {
        @apply flex-grow;
      }

      .modal-title {
        @apply text-lg font-bold mb-1;
      }

      .modal-message {
        @apply text-sm;
      }

      @keyframes modal-show {
        from {
          opacity: 0;
          transform: scale(0.95) translateY(20px);
        }
        to {
          opacity: 1;
          transform: scale(1) translateY(0);
        }
      }

      .animate-modal-show {
        animation: modal-show 0.3s ease-out forwards;
      }
    `,
  ],
})
export class AlertModalComponent {
  @Input() isVisible = false;
  @Input() message = '';
  @Input() isSuccess = true;
  @Input() title = '';

  @Output() closeEvent = new EventEmitter<void>();

  @HostListener('document:keydown.escape')
  handleEscapeKey() {
    if (this.isVisible) {
      this.closeModal();
    }
  }

  onOverlayClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.closeModal();
    }
  }

  closeModal() {
    this.closeEvent.emit();
  }
}
