import { Component, OnInit } from '@angular/core';
import {ChatDetails} from '../../models/model';
import {animate, group, style, transition, trigger} from '@angular/animations';
import {ActivatedRoute} from '@angular/router';
import {SocketService} from '../../Services/socket-io/socket.service';
declare const $: any;
@Component({
  selector: 'app-chat-details',
  templateUrl: './chat-details.component.html',
  styleUrls: ['./chat-details.component.scss'],
  animations: [
    trigger('scaleIn', [
      transition('void => *', [
        style({
          opacity: 0,
          transform: 'translateX(-50%)'
        }), group([
          animate(250, style({
            opacity: 1
          })), animate(250, style({
            transform: 'translateX(0)'
          }))
        ])
      ])
    ])]
})
export class ChatDetailsComponent implements OnInit {
  currentRoomId;
  chatDetailsContainer: ChatDetails[] = [];

  currentMessage = '';

  constructor(private activateRouter: ActivatedRoute, public socket: SocketService) {
    this.activateRouter.params.subscribe(res => {
      this.currentRoomId = res.id;
      this.emitToGetChat();
      console.log(this.currentRoomId);
    });
  }

  ngOnInit(): void {
  }

  emitMessage(): void {
    if (this.currentMessage.trim() === '') {
      return;
    } else {
      this.socket.emit('privateMessage', {
        messageData: {
          firstName: this.socket.userContainer.firstName,
          lastName: this.socket.userContainer.lastName,
          message: this.currentMessage,
          to: this.socket.userContainer._id === this.socket.chatRoomContainer.chatRoom.firstUser._id ? this.socket.chatRoomContainer.chatRoom.secondUser._id : this.socket.chatRoomContainer.chatRoom.firstUser._id
        }, userToken: this.socket.token
      });
      this.socket.getDown();
      this.clearMessageBox();
    }
  }



  clearMessageBox(): void {
    this.currentMessage = '';
  }

  emitToGetChat(): void {
    this.socket.emit('joinRoom', {
      chatRoomId: this.currentRoomId,
      userToken: this.socket.token
    });
  }
}
