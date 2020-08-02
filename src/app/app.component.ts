import {Component, OnInit} from '@angular/core';
import Uikit from 'uikit';
import {animate, group, style, transition, trigger} from '@angular/animations';
import {AuthenticationService} from './Services/authentication.service';
import {UserDetailsService} from './Services/user/user-details.service';
import {Accept, FriendRequests, Notifications, User} from './models/model';
import {FreindsDetailsService} from './Services/friends/freinds-details.service';
import Swal from 'sweetalert2';
import {SocketService} from './Services/socket-io/socket.service';
declare const $:any;
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    animations: [
        trigger('scaleIn', [
            transition('void => *', [
                style({
                    opacity: 0,
                    transform: 'translateY(20px)'
                }), group([
                    animate(150, style({
                        opacity: 1
                    })), animate(150, style({
                        transform: 'translateY(0)'
                    }))
                ])
            ])
        ])
    ],
})
export class AppComponent implements OnInit{
    // variables
    title = 'chatsapp';
    logoutToggleVar = false;
    fRequestVar = false;
    notifactionsVar = false;
    sendRequest = false;
    // arries
    // Sweet alert
    Toast = Swal.mixin({
        toast: true,
        position: 'top-left',
        showConfirmButton: false,
        timer: 2500,
        timerProgressBar: true,
        onOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer);
            toast.addEventListener('mouseleave', Swal.resumeTimer);
        }
    });
    constructor(public auth: AuthenticationService, public user: UserDetailsService, private friend: FreindsDetailsService, public socket: SocketService) {
    }

    ngOnInit(): void {
        document.addEventListener('visibilitychange', this.visibilityState, false);
    }

    acceptThisUser(requestId, fromUserId): void {
        this.sendRequest = true;
        const acceptReq: Accept = {
            friendRequestId: requestId,
            fromId: fromUserId,
        };

        this.friend.acceptFriendRequest(acceptReq).subscribe(res => {
            this.alertSuccess('Request Accepted');
            this.socket.getUserAfterLoggedIn();
            this.sendRequest = false;
        }, err => {this.sendRequest = false; this.alertDanger('Something went wrong'); });
    }
    rejectThisUser(requestId, fromUserId): void {
        this.sendRequest = true;
        this.friend.rejectFriendRequest(requestId, fromUserId).subscribe(res => {
            this.alertSuccess('Request Rejected');
            this.socket.getUserAfterLoggedIn();
            this.sendRequest = false;
        }, err => {this.sendRequest = false; this.alertDanger('Something went wrong'); });
    }
    // special cases
    closeMe(): void {
        Uikit.offcanvas('#offcanvas-push').hide();
    }

    LogoutToggle(): void {
        this.logoutToggleVar = !this.logoutToggleVar;
        this.notifactionsVar = false;
        this.fRequestVar = false;
    }

    toggleFriendRequest(): void {
        this.fRequestVar = !this.fRequestVar;
        this.notifactionsVar = false;
        this.logoutToggleVar = false;
    }
    toggleNotifactions(): void {
        this.notifactionsVar = !this.notifactionsVar;
        this.fRequestVar = false;
        this.logoutToggleVar = false;
    }

    deleteThisNotification(id, index): void {
        // this.socket.userContainer.notifications.splice(index, 1);
        const notificationCopy = [...this.socket.userContainer.notifications];
        const filterdNotifications = notificationCopy.filter(filtered => filtered._id !== id);
        this.socket.userContainer.notifications = filterdNotifications;
        this.user.deleteNotification(id).subscribe(res => {
            // this.getUserAfterLoggedIn();
            console.log(res);
        });
    }

    alertSuccess(message: string): void {
        this.Toast.fire({
            icon: 'success',
            title: message
        });
    }

    alertDanger(message: string): void {
        this.Toast.fire({
            icon: 'error',
            title: message
        });
    }

    visibilityState(): void {
        if (document.visibilityState === 'visible') {
            console.log('visible');
        }
        if (document.visibilityState === 'hidden') {
            console.log('hidden');
        }
    }



}
