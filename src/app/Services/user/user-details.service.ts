import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class UserDetailsService {
  // token
  token = localStorage.getItem('chatsapp-token');

  constructor(private http: HttpClient) { }

  // ********* GET USER AFTER LOGIN ********** //

  getUserAfterLogin(): Observable<any> {
    return this.http.get(`${environment.apiWithUrl}/users/userAfterLogin`, {
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    });
  }
  // ********* DELETE NOTIFICATION ********** //
  deleteNotification(id): Observable<any> {
    return this.http.delete(`${environment.apiWithUrl}/users/removeNotification/${id}`, {
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    });
  }
}
