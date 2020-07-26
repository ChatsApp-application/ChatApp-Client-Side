import {Injectable} from '@angular/core';
import * as io from 'socket.io-client';
import {Observable} from 'rxjs';
import {MyChats, User, UserChats} from '../../models/model';
import {UserDetailsService} from '../user/user-details.service';
import {AuthenticationService} from '../authentication.service';

@Injectable({
    providedIn: 'root'
})
export class SocketService {
    // variables
    socket: any;
    readonly url: string = 'https://chats--app.herokuapp.com/';
    token = localStorage.getItem('chatsapp-token');
    // arraies
    userContainer: User = {};
    allChatListContainer: MyChats = {};
    constructor(private user: UserDetailsService, private auth: AuthenticationService) {
        this.socket = io(this.url);
        if (this.auth.isLoggedIn()) {
            this.getUserAfterLoggedIn();
        }
        this.listenToFriendRequests();
        this.listenToRejectionNotification();
        this.listenToMyChats();
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

    trackByFn(index, item) {
        return index; // or item.id
    }

    listenToFriendRequests(): void {
        this.listen('friendRequest').subscribe(res => {
            console.log(res);
            if (this.userContainer._id === res['to']) {
                console.log('reached');
                this.userContainer.friendRequests.push(res['friendRequest']);
                console.log('friendRequests', this.userContainer.friendRequests);
            }
        });
    }

    listenToRejectionNotification(): void {
        this.listen('informingNotification').subscribe(res => {
            if (this.userContainer._id === res['to']) {
                this.userContainer.notifications.unshift(res['notification']);
            }
        });
    }


    listenToMyChats(): void {
        this.listen('userChats').subscribe(res => {
            this.allChatListContainer = res;
            console.log(res);
        });
    }

    // *************** data of user after login ***************** //
    getUserAfterLoggedIn(): void {
        this.user.getUserAfterLogin().subscribe(res => {
            this.userContainer = res.user;
        });
    }
}
