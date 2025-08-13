import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

declare var $: any; // jQuery vulnerability

@Component({
  selector: 'app-dashboard',
  template: `
    <div>
      <h2>Admin Dashboard</h2>
      <p style="color: orange;">⚠️ This dashboard shows all users without proper authorization checks!</p>
      
      <!-- Search functionality with XSS vulnerability -->
      <div style="margin-bottom: 20px;">
        <input type="text" [(ngModel)]="searchTerm" placeholder="Search users..." 
               style="width: 300px; margin-right: 10px;">
        <button (click)="searchUsers()" class="btn btn-primary">Search</button>
        <button (click)="loadAllUsers()" class="btn btn-primary" style="margin-left: 10px;">Load All Users</button>
      </div>
      
      <!-- Display search results with XSS vulnerability -->
      <div *ngIf="searchResults" style="margin-bottom: 20px;">
        <h3>Search Results:</h3>
        <!-- Vulnerable: Direct HTML injection -->
        <div [innerHTML]="searchResults"></div>
      </div>
      
      <!-- User list -->
      <div *ngIf="users && users.length > 0">
        <h3>All Users (Including Passwords!)</h3>
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
          <thead>
            <tr style="background-color: #f8f9fa;">
              <th style="border: 1px solid #ddd; padding: 8px;">ID</th>
              <th style="border: 1px solid #ddd; padding: 8px;">Username</th>
              <th style="border: 1px solid #ddd; padding: 8px;">Password</th>
              <th style="border: 1px solid #ddd; padding: 8px;">Email</th>
              <th style="border: 1px solid #ddd; padding: 8px;">Role</th>
              <th style="border: 1px solid #ddd; padding: 8px;">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let user of users">
              <td style="border: 1px solid #ddd; padding: 8px;">{{ user.id }}</td>
              <td style="border: 1px solid #ddd; padding: 8px;">{{ user.username }}</td>
              <td style="border: 1px solid #ddd; padding: 8px; color: red;">{{ user.password }}</td>
              <td style="border: 1px solid #ddd; padding: 8px;">{{ user.email }}</td>
              <td style="border: 1px solid #ddd; padding: 8px;">{{ user.role }}</td>
              <td style="border: 1px solid #ddd; padding: 8px;">
                <button (click)="deleteUser(user.id)" class="btn btn-danger" style="font-size: 12px;">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Direct SQL injection test interface -->
      <div style="margin-top: 30px; padding: 15px; border: 2px solid #dc3545; background-color: #fff5f5;">
        <h3 style="color: #dc3545;">🚨 SQL Injection Test Area</h3>
        <p>Try entering: <code>' OR '1'='1' --</code> in username field</p>
        <div class="form-group">
          <label>Username (SQL Injectable):</label>
          <input type="text" [(ngModel)]="sqlUsername" style="width: 300px;">
        </div>
        <div class="form-group">
          <label>Password:</label>
          <input type="text" [(ngModel)]="sqlPassword" style="width: 300px;">
        </div>
        <button (click)="testSqlInjection()" class="btn btn-danger">Test SQL Injection</button>
        
        <div *ngIf="sqlResult" style="margin-top: 15px;">
          <h4>SQL Result:</h4>
          <pre>{{ sqlResult | json }}</pre>
        </div>
      </div>
      
      <!-- Client-side eval vulnerability -->
      <div style="margin-top: 20px; padding: 15px; border: 2px solid #ffc107; background-color: #fffdf0;">
        <h3 style="color: #856404;">⚠️ JavaScript Eval Test</h3>
        <p>Enter JavaScript code to execute (Very Dangerous!):</p>
        <textarea [(ngModel)]="jsCode" placeholder="alert('XSS'); document.cookie" 
                  style="width: 100%; height: 60px; margin-bottom: 10px;"></textarea>
        <button (click)="executeJs()" class="btn btn-danger">Execute JS</button>
      </div>
      
      <div *ngIf="errorMessage" class="alert alert-danger" style="margin-top: 15px;">
        {{ errorMessage }}
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  users: any[] = [];
  searchTerm: string = '';
  searchResults: string = '';
  sqlUsername: string = '';
  sqlPassword: string = '';
  sqlResult: any = null;
  jsCode: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.loadAllUsers();
  }

  loadAllUsers() {
    this.authService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.errorMessage = '';
      },
      error: (error) => {
        this.errorMessage = 'Failed to load users: ' + (error.error?.message || 'Unknown error');
      }
    });
  }

  searchUsers() {
    if (!this.searchTerm) {
      this.searchResults = '';
      return;
    }

    // XSS Vulnerability: Direct HTML injection without sanitization
    this.searchResults = `<p>Search results for: <strong>${this.searchTerm}</strong></p>`;
    
    // Simulated search with potential XSS
    const filteredUsers = this.users.filter(user => 
      user.username.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(this.searchTerm.toLowerCase())
    );

    if (filteredUsers.length > 0) {
      this.searchResults += '<ul>';
      filteredUsers.forEach(user => {
        // Vulnerable: Direct insertion of user data
        this.searchResults += `<li>User: ${user.username} (${user.email})</li>`;
      });
      this.searchResults += '</ul>';
    } else {
      this.searchResults += '<p style="color: red;">No users found matching your search.</p>';
    }
  }

  testSqlInjection() {
    // This will trigger SQL injection in the backend
    this.authService.login({ 
      username: this.sqlUsername, 
      password: this.sqlPassword 
    }).subscribe({
      next: (response) => {
        this.sqlResult = response;
      },
      error: (error) => {
        this.sqlResult = { error: error.message, details: error.error };
      }
    });
  }

  executeJs() {
    try {
      // Extremely dangerous: Using eval() with user input
      // This allows arbitrary JavaScript execution
      const result = eval(this.jsCode);
      console.log('Executed JS result:', result);
      alert('JavaScript executed! Check console for results.');
    } catch (error) {
      console.error('JS execution error:', error);
      alert('JavaScript execution failed: ' + error);
    }
  }

  deleteUser(userId: number) {
    // Simulate user deletion without proper authorization
    console.log(`Deleting user ${userId} - No authorization check!`);
    this.users = this.users.filter(user => user.id !== userId);
    
    // Using jQuery to manipulate DOM directly (if available)
    if (typeof $ !== 'undefined') {
      $(`#user-${userId}`).fadeOut();
    }
  }
}



