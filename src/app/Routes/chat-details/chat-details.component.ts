import { Component, OnInit } from '@angular/core';
import {ChatDetails} from '../../models/model';
import {animate, group, style, transition, trigger} from '@angular/animations';
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
  currentUserId = 4;
  chatDetailsContainer: ChatDetails[] = [];

  currentMessage: ChatDetails = {
    id: null,
    from: '',
    fullDate: null,
    message: '',
    seen: null
  };

  constructor() {
  }

  ngOnInit(): void {

  }

  sendMessage(): void {
    if (this.currentMessage.message.trim() === '') {
      return;
    } else {
      this.currentMessage.id = 4;
      this.currentMessage.fullDate = new Date();
      this.currentMessage.from = 'Mustafa Mahmoud';
      this.currentMessage.seen = true;
      this.chatDetailsContainer.push({...this.currentMessage});
      this.clearMessageBox();
      this.getDown();
      setTimeout(() => {
        this.currentMessage.id = 6;
        this.currentMessage.fullDate = new Date();
        this.currentMessage.from = 'Muhammed Mahmoud';
        this.currentMessage.message = 'ezyak';
        this.currentMessage.seen = false;
        this.chatDetailsContainer.push({...this.currentMessage});
        this.clearMessageBox();
        this.getDown();
      }, 1500);
    }
  }

  getDown(): void {
    const scrollDiv = $('.middle-box');
    scrollDiv.animate({scrollTop: scrollDiv.prop('scrollHeight')}, 400);
  }

  clearMessageBox(): void {
    this.currentMessage.message = '';
  }
}
