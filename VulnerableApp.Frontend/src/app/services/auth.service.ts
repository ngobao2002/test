import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: any;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, credentials);
  }

  getUserProfile(userId: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = { 'Authorization': `Bearer ${token}` };
    return this.http.get(`${this.apiUrl}/auth/profile/${userId}`, { headers });
  }

  getAllUsers(): Observable<any[]> {
    const token = localStorage.getItem('token');
    const headers = { 'Authorization': `Bearer ${token}` };
    return this.http.get<any[]>(`${this.apiUrl}/auth/users`, { headers });
  }

  // Insecure deserialization endpoint
  deserializeData(data: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/deserialize`, JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Debug endpoint exposing sensitive config
  getDebugConfig(): Observable<any> {
    return this.http.get(`${this.apiUrl}/auth/debug/config`);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getCurrentUser(): any {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
}



