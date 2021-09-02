import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  login(username, password) {
    const user = {
      'username': username,
      'password': password
    };
    return this.http.post(environment.apiUrl + 'login', user);
  }

  secureCall() {
    return this.http.get(environment.apiUrl + 'login');
  }
}
