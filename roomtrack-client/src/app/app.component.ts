import { Component } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet, Event } from '@angular/router';
import { CommonModule } from '@angular/common';
import { enhancedPageAnimation } from './shared/animations/animations';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [enhancedPageAnimation],
})
export class AppComponent {
  getRouteState(outlet: RouterOutlet) {
    return outlet?.isActivated ? outlet.activatedRoute.snapshot.url[0]?.path || 'default' : 'default';
  }
}
