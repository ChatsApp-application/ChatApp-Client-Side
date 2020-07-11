import { Component, OnInit } from '@angular/core';
import {ChatDetails} from '../../models/model';
declare const $: any;
@Component({
  selector: 'app-chat-details',
  templateUrl: './chat-details.component.html',
  styleUrls: ['./chat-details.component.scss']
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

  getDown(): void {
    // const scrollDiv = document.querySelector('.middle-box') as HTMLInputElement;
    // scrollDiv.scrollTo(0, scrollDiv.scrollHeight);
    // scrollDiv.scrollTop = (scrollDiv.scrollHeight + 54646);
    // console.log(scrollDiv.scrollHeight);
    const scrollDiv = $('.middle-box');
    scrollDiv.animate({scrollTop: scrollDiv.prop('scrollHeight')}, 400);
  }

  clearMessageBox(): void {
    this.currentMessage.message = '';
  }
}
