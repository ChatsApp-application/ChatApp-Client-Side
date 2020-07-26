import { Component, OnInit } from '@angular/core';
import {animate, group, style, transition, trigger} from '@angular/animations';
import {SocketService} from '../../Services/socket-io/socket.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-mychats',
  templateUrl: './mychats.component.html',
  styleUrls: ['./mychats.component.scss'],
  animations: [
    trigger('scaleIn', [
      transition('void => *', [
        style({
          opacity : 0,
          transform : 'translateX(-50%)'
        }), group([
          animate(250, style({
            opacity : 1
          })), animate(250, style({
            transform : 'translateX(0)'
          }))
        ])
      ])
    ]),
      trigger('scaleUp', [
          transition('void => *', [
              style({
                  opacity: 0,
                  transform: 'translateY(-50%)'
              }), group([
                  animate(250, style({
                      opacity: 1
                  })), animate(250, style({
                      transform: 'translateY(0)'
                  }))
              ])
          ])
      ])
  ]
})
export class MychatsComponent implements OnInit {
  // variables
  emitChatsSub: Subscription;
  constructor(public socket: SocketService) {
    this.emitMyChats();
  }

  ngOnInit(): void {
  }

  emitMyChats(): void {
    this.socket.emit('onChats', {
      userToken: this.socket.token
    });
  }
}
