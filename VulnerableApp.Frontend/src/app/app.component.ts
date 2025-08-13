import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  template: `
    <div class="container">
      <nav style="margin-bottom: 20px; padding: 10px; background-color: #f8f9fa; border-radius: 4px;">
        <h2 style="margin: 0; display: inline-block;">Vulnerable Web App</h2>
        <div style="float: right;">
          <button class="btn btn-primary" style="margin-right: 10px;" (click)="navigate('/login')">Login</button>
          <button class="btn btn-primary" style="margin-right: 10px;" (click)="navigate('/profile')">Profile</button>
          <button class="btn btn-primary" style="margin-right: 10px;" (click)="navigate('/dashboard')">Dashboard</button>
          <button class="btn btn-danger" (click)="logout()">Logout</button>
        </div>
        <div style="clear: both;"></div>
      </nav>
      <router-outlet></router-outlet>
    </div>
  `
})
export class AppComponent {
  constructor(private router: Router) {}

  navigate(route: string) {
    this.router.navigate([route]);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
}



