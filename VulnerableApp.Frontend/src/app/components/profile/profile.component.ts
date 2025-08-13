import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  template: `
    <div>
      <h2>User Profile</h2>
      
      <!-- Direct access to any user profile without authorization -->
      <div class="form-group">
        <label for="userId">View Profile for User ID:</label>
        <input type="text" id="userId" [(ngModel)]="targetUserId" placeholder="Enter user ID">
        <button (click)="loadProfile()" class="btn btn-primary" style="margin-left: 10px;">Load Profile</button>
      </div>
      
      <div *ngIf="userProfile" style="margin-top: 20px;">
        <h3>Profile Information</h3>
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 4px;">
          <p><strong>ID:</strong> {{ userProfile.id }}</p>
          <p><strong>Username:</strong> {{ userProfile.username }}</p>
          <p><strong>Email:</strong> {{ userProfile.email }}</p>
          <p><strong>Full Name:</strong> {{ userProfile.fullName }}</p>
          <p><strong>Role:</strong> {{ userProfile.role }}</p>
          <p><strong>Created At:</strong> {{ userProfile.createdAt | date }}</p>
        </div>
      </div>
      
      <!-- XSS Vulnerability: User bio section -->
      <div style="margin-top: 20px;">
        <h3>User Bio</h3>
        <textarea [(ngModel)]="userBio" placeholder="Enter your bio..." 
                  style="width: 100%; height: 100px; margin-bottom: 10px;"></textarea>
        <button (click)="saveBio()" class="btn btn-primary">Save Bio</button>
        
        <!-- Vulnerable: Displaying HTML content without sanitization -->
        <div *ngIf="displayBio" style="margin-top: 15px; padding: 10px; border: 1px solid #ddd; border-radius: 4px;">
          <h4>Your Bio:</h4>
          <div [innerHTML]="displayBio"></div>
        </div>
      </div>
      
      <!-- Insecure deserialization test -->
      <div style="margin-top: 20px; border: 2px solid #ff9999; padding: 15px;">
        <h3>Debug: Deserialization Test</h3>
        <p style="color: red;">⚠️ This is a dangerous feature for testing purposes only!</p>
        <textarea [(ngModel)]="jsonData" placeholder="Enter JSON data to deserialize..." 
                  style="width: 100%; height: 80px; margin-bottom: 10px;"></textarea>
        <button (click)="testDeserialization()" class="btn btn-danger">Deserialize Data</button>
        
        <div *ngIf="deserializationResult" style="margin-top: 10px;">
          <h4>Result:</h4>
          <pre>{{ deserializationResult | json }}</pre>
        </div>
      </div>
      
      <div *ngIf="errorMessage" class="alert alert-danger" style="margin-top: 15px;">
        {{ errorMessage }}
      </div>
    </div>
  `
})
export class ProfileComponent implements OnInit {
  userProfile: any = null;
  targetUserId: string = '';
  userBio: string = '';
  displayBio: string = '';
  jsonData: string = '';
  deserializationResult: any = null;
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    // Load current user profile by default
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.targetUserId = currentUser.id.toString();
      this.loadProfile();
    } else {
      this.router.navigate(['/login']);
    }
  }

  loadProfile() {
    if (!this.targetUserId) {
      this.errorMessage = 'Please enter a user ID';
      return;
    }

    // No validation - allows access to any user profile
    this.authService.getUserProfile(this.targetUserId).subscribe({
      next: (profile) => {
        this.userProfile = profile;
        this.errorMessage = '';
      },
      error: (error) => {
        this.errorMessage = 'Failed to load profile: ' + (error.error?.message || 'Unknown error');
        this.userProfile = null;
      }
    });
  }

  saveBio() {
    // XSS Vulnerability: Saving and displaying HTML content without sanitization
    this.displayBio = this.userBio;
    
    // Simulating save to localStorage (also insecure)
    localStorage.setItem('userBio_' + this.targetUserId, this.userBio);
  }

  testDeserialization() {
    if (!this.jsonData) {
      this.errorMessage = 'Please enter JSON data';
      return;
    }

    // Insecure deserialization test
    this.authService.deserializeData(this.jsonData).subscribe({
      next: (result) => {
        this.deserializationResult = result;
        this.errorMessage = '';
      },
      error: (error) => {
        this.errorMessage = 'Deserialization failed: ' + error.message;
      }
    });
  }
}



