import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// All my auth logic. 
//registration, login, logout, token managemaent+ helper method to check if user is logged in
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'https://localhost:7195/api/auth';

  constructor(private http: HttpClient) {}

  register(email: string, password: string) {
    return this.http.post(`${this.apiUrl}/register`, 
      { email, password },
      { responseType: 'text' }
    );
  }

  login(email: string, password: string) {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, 
      { email, password }
    );
  }

  saveToken(token: string) {
    localStorage.setItem('filmlog_token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('filmlog_token');
  }

  logout() {
    localStorage.removeItem('filmlog_token');
  }

  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }
}