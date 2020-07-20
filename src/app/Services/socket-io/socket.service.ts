import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import {Observable} from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class SocketService {
  // variables
  socket: any;
  readonly  url: string = 'https://chats--app.herokuapp.com/';
  currentUserId = localStorage.getItem('chats-user-id');
  // arraies
  notificationSocketContainer: Notification[] = [];
  constructor() {
    this.socket = io(this.url);
    this.listenToFriendRequests();
  }

  listen(eventName: string) {
    return new Observable((subscriber) => {
      this.socket.on(eventName, (data) => {
        subscriber.next(data);
      });
    });
  }

  emit(eventName: string, data: any): void {
    this.socket.emit(eventName, data);
  }

  listenToFriendRequests(): void {
    this.listen('friendRequest').subscribe(res => {
      console.log(res);
      if (this.currentUserId.toString() === res['to']._id) {
        this.notificationSocketContainer = res['friendRequest'];
      }
    });
  }
}
