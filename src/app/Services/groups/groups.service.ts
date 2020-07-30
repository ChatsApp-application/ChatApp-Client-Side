import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class GroupsService {
  token = localStorage.getItem('chatsapp-token');
  constructor(private http: HttpClient) { }
  // ************** GET ALL GROUPS ************** //
  getAllGroups(): Observable<any> {
    return this.http.get(`${environment.apiWithUrl}/groups/userGroups`, {
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    });
  }

  // ************** CREAT A GROUP ************** //
  createGroup(data): Observable<any> {
    return this.http.post(`${environment.apiWithUrl}/groups/createGroup`, data, {
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    });
  }
}
