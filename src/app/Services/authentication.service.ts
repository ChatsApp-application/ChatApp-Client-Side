import { Injectable } from '@angular/core';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment.prod';
import {SocketService} from './socket-io/socket.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private router: Router, private http: HttpClient) { }

  // ******** LOGIN ********* //
  loginAuth(data): Observable<any> {
    return this.http.post(`${environment.apiWithUrl}/auth/signin`, data);
  }

  // ******** REGISTER ********* //
  registerAuth(data): Observable<any> {
    return this.http.post(`${environment.apiWithUrl}/auth/signup`, data);
  }

  saveToken(token): void {
    localStorage.setItem('chatsapp-token', token);
  }

   isLoggedIn() {
    return !!localStorage.getItem('chatsapp-token');
  }

  logOut(): void {

    localStorage.removeItem('chatsapp-token');
    this.router.navigateByUrl('/login');
    // emit event  >> socket.emit('userLogout', {userId: userId})
  }
}
