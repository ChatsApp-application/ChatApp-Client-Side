import {Component, OnInit} from '@angular/core';
import {animate, group, style, transition, trigger} from '@angular/animations';
import {SocketService} from '../../Services/socket-io/socket.service';
import {Subscription} from 'rxjs';
import {UserChats} from '../../models/model';

@Component({
    selector: 'app-mychats',
    templateUrl: './mychats.component.html',
    styleUrls: ['./mychats.component.scss'],
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
    searchText = '';
    toggleArray = false;
    emitChatsSub: Subscription;
    // arraies
    filteredArray: UserChats[] = [];

    constructor(public socket: SocketService) {
        this.emitMyChats();
    }

    ngOnInit(): void {
        this.listenToUnSeenMessages();
        this.listenToNewMessages();
    }

    emitMyChats(): void {
        this.socket.emit('onChats', {
            userToken: this.socket.token
        });
    }

    filterChats(): void {
        if (this.searchText.trim() === '') {
            this.toggleArray = false;
        } else {
            this.toggleArray = true;
            this.filteredArray = this.socket.allChatListContainer.userChats.filter((filtered) => this.socket.userContainer._id === filtered.firstUser._id ? `${filtered.secondUser.firstName} ${filtered.secondUser.lastName}`.toLowerCase().includes(this.searchText) : `${filtered.firstUser.firstName} ${filtered.firstUser.lastName}`.toLowerCase().includes(this.searchText));
        }
    }

    listenToNewMessages(): void {
        this.socket.listen('privateMessageBackFromOutside').subscribe(res => {
            if (this.socket.userContainer._id === res) {
                this.emitMyChats();
            }
        });
    }

    listenToUnSeenMessages(): void {
        this.socket.listen('setUnseenMessagesToTrue').subscribe(res => {
            if (res['to'] === this.socket.userContainer._id) {
                this.socket.allChatListContainer.userChats.forEach(chat => {
                    if (chat._id === res['room']) {
                        chat.lastMessage.seen = true;
                    }
                });
            }
        });
    }
}
