import {Injectable} from '@angular/core';
import * as io from 'socket.io-client';
import {Observable} from 'rxjs';
import {ChatDetails, ChatRoom, GroupData, GroupMembers, MyChats, User, UserChats} from '../../models/model';
import {UserDetailsService} from '../user/user-details.service';
import {AuthenticationService} from '../authentication.service';
import {ActivatedRoute, Router} from '@angular/router';

declare const $: any;

@Injectable({
    providedIn: 'root'
})
export class SocketService {
    // variables
    socket: any;
    emptyFriendsAlert = false;
    emptyNotificationsAlert = false;
    emptyChatsAlert = false;
    readonly url: string = 'https://chats--app.herokuapp.com/';
    token = localStorage.getItem('chatsapp-token');
    // arraies
    userContainer: User = {};
    allChatListContainer: MyChats = {};
    chatRoomContainer: ChatDetails = {};
    groupData: GroupData = {};

    constructor(private user: UserDetailsService, private auth: AuthenticationService, private router: Router) {
        this.socket = io(this.url);
        if (this.auth.isLoggedIn()) {
            this.getUserAfterLoggedIn();
        }
        this.listeners();
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

    // *************** NOTIFICATIONS AND FRIEND REQUESTS PART ***************** //

    listenToFriendRequests(): void {
        this.listen('friendRequest').subscribe(res => {
            console.log(res);
            if (this.userContainer._id === res['to']) {
                console.log('reached');
                this.userContainer.friendRequests.push(res['friendRequest']);
                console.log('friendRequests', this.userContainer.friendRequests);
                this.emptyFriendsAlert = true;
            }
        });
    }

    listenToRejectionNotification(): void {
        this.listen('informingNotification').subscribe(res => {
            if (this.userContainer._id === res['to']) {
                this.userContainer.notifications.unshift(res['notification']);
                this.emptyNotificationsAlert = true;
            }
        });
    }

    // *************** PRIVATE CHAT PART  ***************** //

    listenToMyChats(): void {
        this.listen('userChats').subscribe(res => {
            if (this.userContainer._id === res['userId']) {
                this.allChatListContainer = res;
                if (this.allChatListContainer.userChats.length === 0) {
                    this.emptyChatsAlert = true;
                } else {
                    this.emptyChatsAlert = false;
                }
                console.log(res);
            }
        });
    }

    listenToChatDetails(): void {
        this.listen('chatRoomIsJoined').subscribe(res => {
            if (this.userContainer._id === res['to']) {
                this.chatRoomContainer = res;
                console.log(this.chatRoomContainer);
                setTimeout(() => {
                    this.getDownWhenEnter();
                }, 200);
            }
        });
    }

    listenToMessages(): void {
        this.listen('privateMessageBack').subscribe(res => {
            this.chatRoomContainer.chatRoom.chatHistory.push(res);
            this.getDown();
            console.log(res);
        });
    }

    // *************** GROUP PART ***************** //

    listenToJoiningGroup(): void {
        this.listen('atGroupRoom').subscribe(res => {
            if (this.userContainer._id === res['to']) {
                this.groupData = res;
                localStorage.setItem('g-id', res['group']['_id']);
                setTimeout(() => {
                    this.getDownWhenEnter();
                }, 200);
                console.log(this.groupData);
            }
        });
    }

    listenToGroupMessage(): void {
        this.listen('groupMessage').subscribe(res => {
            console.log(res);
            this.groupData.group.chatHistory.push(res);
            this.getDown();
        });
    }

    listenToKickedMembers(): void {
        this.listen('kickedFromGroup').subscribe(res => {
            console.log(res);
            this.groupData.group.groupMembers.forEach((member, index) => {
                if (localStorage.getItem('g-id') === res['groupId']) {
                    if (member._id === res['kickedUser'] && this.userContainer._id !== res['kickedUser']) {
                        this.groupData.group.groupMembers.splice(index, 1);
                    }
                    if (res['kickedUser'] === this.userContainer._id) {
                        this.router.navigate(['/groups']);
                    }
                }
            });
        });
    }

    listenToAddUser(): void {
        this.listen('usersAddedToGroup').subscribe(res => {
            if (this.groupData?.group?._id === res['group']) {
                res['addedUsers'].forEach(member => {
                   this.groupData.group.groupMembers.push(member);
                });
            }
        });
    }

    // *************** data of user after login ***************** //

    getUserAfterLoggedIn(): void {
        this.user.getUserAfterLogin().subscribe(res => {
            this.userContainer = res.user;
            if (this.userContainer.friendRequests.length === 0) {
                this.emptyFriendsAlert = false;
            } else {
                this.emptyFriendsAlert = true;
            }
            if (this.userContainer.notifications.length === 0) {
                this.emptyNotificationsAlert = false;
            } else {
                this.emptyNotificationsAlert = true;
            }
        });
    }

    getDown(): void {
        const scrollDiv = $('.middle-box');
        scrollDiv.animate({scrollTop: scrollDiv.prop('scrollHeight')}, 400);
    }

    getDownWhenEnter(): void {
        const scrollDiv = $('.middle-box');
        scrollDiv.animate({scrollTop: scrollDiv.prop('scrollHeight')}, 0);
    }

    showLoader(): void {
        $('.preloader').fadeIn();
    }

    hideLoader(): void {
        $('.preloader').fadeOut();
    }

    listeners(): void {
        this.listenToFriendRequests();
        this.listenToRejectionNotification();
        this.listenToMyChats();
        this.listenToChatDetails();
        this.listenToMessages();
        this.listenToJoiningGroup();
        this.listenToGroupMessage();
        this.listenToKickedMembers();
        this.listenToAddUser();
    }
}
