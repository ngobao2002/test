import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-login',
  template: `
    <div>
      <h2>Login</h2>
      
      <!-- XSS Vulnerability: Displaying unescaped user input -->
      <div *ngIf="welcomeMessage" [innerHTML]="welcomeMessage" class="alert alert-success"></div>
      
      <form (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label for="username">Username:</label>
          <input type="text" id="username" [(ngModel)]="username" name="username" required>
        </div>
        
        <div class="form-group">
          <label for="password">Password:</label>
          <input type="password" id="password" [(ngModel)]="password" name="password" required>
        </div>
        
        <button type="submit" class="btn btn-primary">Login</button>
        <button type="button" class="btn btn-primary" style="margin-left: 10px;" (click)="useDefaultCredentials()">
          Use Default Admin
        </button>
      </form>
      
      <div *ngIf="errorMessage" class="alert alert-danger" style="margin-top: 15px;">
        {{ errorMessage }}
      </div>
      
      <!-- XSS Vulnerability: User comments section -->
      <div style="margin-top: 30px;">
        <h3>User Comments</h3>
        <div>
          <input type="text" [(ngModel)]="newComment" placeholder="Add a comment..." style="width: 70%; margin-right: 10px;">
          <button (click)="addComment()" class="btn btn-primary">Add Comment</button>
        </div>
        
        <!-- Vulnerable: Directly inserting HTML without sanitization -->
        <div *ngFor="let comment of comments" class="user-comment" [innerHTML]="comment"></div>
      </div>
      
      <!-- Debug info that shouldn't be visible -->
      <div style="margin-top: 20px; padding: 10px; background-color: #ffe6e6; border: 1px solid #ff9999;">
        <h4>Debug Info (Should not be in production!)</h4>
        <p>Default credentials: {{ defaultCredentials.username }} / {{ defaultCredentials.password }}</p>
        <p>API Key: {{ apiKey }}</p>
        <button (click)="showDebugConfig()" class="btn btn-danger">Show Server Config</button>
        <div *ngIf="debugConfig" style="margin-top: 10px;">
          <pre>{{ debugConfig | json }}</pre>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';
  welcomeMessage: string = '';
  newComment: string = '';
  comments: string[] = [];
  debugConfig: any = null;
  
  // Exposed sensitive information
  defaultCredentials = environment.defaultCredentials;
  apiKey = environment.apiKey;

  constructor(private authService: AuthService, private router: Router) {
    // Get welcome message from URL parameter (vulnerable to XSS)
    const urlParams = new URLSearchParams(window.location.search);
    const welcome = urlParams.get('welcome');
    if (welcome) {
      this.welcomeMessage = welcome; // Direct assignment without sanitization
    }
  }

  onSubmit() {
    if (!this.username || !this.password) {
      this.errorMessage = 'Please enter username and password';
      return;
    }

    this.authService.login({ username: this.username, password: this.password })
      .subscribe({
        next: (response) => {
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));
          this.router.navigate(['/profile']);
        },
        error: (error) => {
          this.errorMessage = 'Login failed: ' + error.error?.message || 'Unknown error';
        }
      });
  }

  useDefaultCredentials() {
    this.username = this.defaultCredentials.username;
    this.password = this.defaultCredentials.password;
  }

  addComment() {
    if (this.newComment.trim()) {
      // XSS Vulnerability: Adding user input directly without sanitization
      this.comments.push(this.newComment);
      this.newComment = '';
    }
  }

  showDebugConfig() {
    this.authService.getDebugConfig().subscribe({
      next: (config) => {
        this.debugConfig = config;
      },
      error: (error) => {
        console.error('Failed to get debug config', error);
      }
    });
  }
}



