import {Component, OnDestroy, OnInit} from '@angular/core';
import Uikit from 'uikit';
import {animate, group, style, transition, trigger} from '@angular/animations';
import {ActivatedRoute, Router} from '@angular/router';
import {GroupsService} from '../../Services/groups/groups.service';
import {GroupFriends} from '../../models/model';
import Swal from 'sweetalert2';
import {SocketService} from '../../Services/socket-io/socket.service';
import {Subscription} from 'rxjs';

declare const $: any;

@Component({
    selector: 'app-group-details',
    templateUrl: './group-details.component.html',
    styleUrls: ['./group-details.component.scss'],
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
        ])]
})
export class GroupDetailsComponent implements OnInit, OnDestroy {
    // variables
    groupID;
    searchText = '';
    sendRequest = false;
    toggleArray = false;
    messageText = '';
    leaveSub: Subscription;
    deleteSub: Subscription;
    // arraies
    groupFriendsContainer: GroupFriends[] = [];
    selectedContainer: GroupFriends[] = [];
    filteredContainer: GroupFriends[] = [];
    // sweet alert
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

    constructor(private groupsService: GroupsService, private activated: ActivatedRoute, public socket: SocketService, private router: Router) {
        this.activated.params.subscribe(res => {
            this.groupID = res.id;
            this.emitToJoinGroup();
        });
    }

    ngOnInit(): void {
        this.listenToLeaveGroup();
        this.listenToDeletedGroup();
        if (this.socket?.groupData?.group?.admin === this.socket?.userContainer?._id && this.groupID !== undefined) {
            this.getFriendList();
        }
    }

    ngOnDestroy(): void {
        this.deleteSub.unsubscribe();
        this.leaveSub.unsubscribe();
    }

    // ************ SOCKET SPECIFICATIONS ************ //
    emitToJoinGroup(): void {
        this.socket.emit('joinGroupRoom', {
            groupId: this.groupID,
            userToken: this.socket.token
        });
    }

    // ************ FRIENDS SPECIFICATIONS ************ //

    sendMessageToGroup(): void {
        if (this.messageText.trim() === '') {
            return;
        } else {
            this.socket.emit('sendGroupMessage', {
                messageData: {
                    firstName: this.socket.userContainer.firstName,
                    lastName: this.socket.userContainer.lastName,
                    message: this.messageText
                }, userToken: this.socket.token
            });
            this.messageText = '';
        }
    }

    filterFriends(): void {
        if (this.searchText.trim() === '') {
            this.toggleArray = false;
        } else {
            this.toggleArray = true;
            this.filteredContainer = this.groupFriendsContainer.filter(data => `${data.firstName.toLowerCase()} ${data.lastName.toLowerCase()}`.includes(this.searchText.toLowerCase()));
        }
    }

    getFriendList(): void {
        this.groupsService.getFriendListForGroup(this.groupID).subscribe(res => {
            this.groupFriendsContainer = res.friendsToAdd;
            console.log(this.groupFriendsContainer);
        });
    }

    addMembersToGroup(): void {
        const membersToAdd = this.selectedContainer.map(data => data._id);
        this.sendRequest = true;
        this.groupsService.addMember({groupId: this.groupID, usersSet: membersToAdd}).subscribe(res => {
            this.sendRequest = false;
            this.alertSuccess('Members added successfully');
            console.log(res);
            this.selectedContainer = [];
            this.searchText = '';
            this.toggleArray = false;
            this.closeModal();
        }, err => {
            this.sendRequest = false;
            this.alertDanger(`${err.error.error}`);
        });
    }

    selectThisMemeber(friend, index): void {
        if (this.toggleArray) {
            this.filteredContainer.splice(index, 1);
            this.groupFriendsContainer.forEach((member, i) => {
                if (member._id === friend._id) {
                    this.groupFriendsContainer.splice(i, 1);
                }
            });
            this.selectedContainer.push({...friend});
        } else {
            this.groupFriendsContainer.splice(index, 1);
            this.selectedContainer.push({...friend});
        }

        console.log(this.selectedContainer);
    }

    returnMember(member, index): void {
        this.toggleArray = false;
        this.selectedContainer.splice(index, 1);
        this.groupFriendsContainer.push({...member});
    }

    kickMembber(member): void {
        Swal.fire({
            title: 'Are you sure?',
            text: `Would you like to kick ${member.firstName}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, kick!'
        }).then((result) => {
            if (result.value) {
                this.groupsService.kickMemberFromGroup({groupId: this.groupID, userToKickId: member._id}).subscribe(res => {
                    this.groupFriendsContainer.push({...member});
                    Swal.fire(
                        'Deleted!',
                        `${res.message}`,
                        'success'
                    );
                }, err => {
                    Swal.fire(
                        'Error happened',
                        `${err.error.error}`,
                        'warning'
                    );
                });
            }
        });

    }

    listenToLeaveGroup(): void {
        this.leaveSub = this.socket.listen('leaveGroup').subscribe(res => {
            if (this.socket.groupData.group._id === res['groupId']) {
                this.socket.groupData.group.groupMembers.forEach((member, index) => {
                    if (member._id === res['userId']) {
                        this.groupFriendsContainer.push(member);
                        this.socket.groupData.group.groupMembers.splice(index, 1);
                    }
                });
            }
            console.log(res);
        });
    }

    listenToDeletedGroup(): void {
        this.deleteSub = this.socket.listen('groupIsDeleted').subscribe(res => {
            console.log(res);
            if (this.socket.groupData.group._id === res['groupId']) {
                this.router.navigate(['/groups']);
            }
        });
    }

    emitChatLeave(): void {
        this.socket.emit('leaveRoomOrGroup', {
            roomId: this.groupID
        });
    }

    // ************ COMPONENT TOOLS ************ //

    closeModal(): void {
        Uikit.modal('#add-member-modal').hide();
    }

    closeDots(): void {
        $('.uk-dropdown').removeClass('uk-open');
    }

    trackByFn(index, item) {
        return index; // or item.id
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
}
