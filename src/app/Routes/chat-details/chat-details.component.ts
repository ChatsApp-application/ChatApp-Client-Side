import {Component, OnDestroy, OnInit} from '@angular/core';
import {ChatDetails} from '../../models/model';
import {animate, group, style, transition, trigger} from '@angular/animations';
import {ActivatedRoute} from '@angular/router';
import {SocketService} from '../../Services/socket-io/socket.service';
import {Observable, Subscription} from 'rxjs';

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
export class ChatDetailsComponent implements OnInit, OnDestroy {
    currentRoomId;
    emitChatSub: Subscription;
    chatDetailsContainer: ChatDetails[] = [];

    currentMessage = '';

    constructor(private activateRouter: ActivatedRoute, public socket: SocketService) {
        this.activateRouter.params.subscribe(res => {
            this.currentRoomId = res.id;
            setTimeout(() => {
                this.emitToGetChat();
            }, 50);
            console.log(this.currentRoomId);
        });
    }

    ngOnInit(): void {
        this.listenToUnSeenMessages();
    }

    ngOnDestroy(): void {
        this.emitChatLeave();
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

    emitChatLeave(): void {
        this.socket.emit('leaveRoomOrGroup', {
            roomId: this.currentRoomId
        });
    }

    clearMessageBox(): void {
        this.currentMessage = '';
    }

    emitToGetChat(): any {
        this.socket.emit('joinRoom', {
            chatRoomId: this.currentRoomId,
            userToken: this.socket.token
        });
    }


    listenToUnSeenMessages(): void {
        this.socket.listen('setUnseenMessagesToTrue').subscribe(res => {
            if (res['room'] === this.currentRoomId && res['to'] === this.socket.userContainer._id) {
                res['messages'].forEach(message => {
                    console.log(message);
                    this.socket?.chatRoomContainer?.chatRoom?.chatHistory.forEach((messageObj) => {
                        if (message === messageObj._id) {
                            messageObj.seen = true;
                        }
                    });
                });
            }
        });
    }

    moveDown(): void {
        const objDiv = document.querySelector('.middle-box');
        objDiv.scrollTop = objDiv.scrollHeight;
        console.log(objDiv);
    }
}
