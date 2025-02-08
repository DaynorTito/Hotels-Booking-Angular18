import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  registering: boolean = false;

  constructor(private router: Router) {}

  register() {
    this.router.navigate(['/register']);
    this.registering = true;
  }

  login() {
    this.router.navigate(['/login']);
  }
}
