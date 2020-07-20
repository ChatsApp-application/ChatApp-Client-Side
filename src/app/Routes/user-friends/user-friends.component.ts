import {Component, OnDestroy, OnInit} from '@angular/core';
import {animate, group, style, transition, trigger} from '@angular/animations';
import {FreindsDetailsService} from '../../Services/friends/freinds-details.service';
import {Friends, MutualFriends} from '../../models/model';
import {Subscription} from 'rxjs';
import Swal from 'sweetalert2';

declare const $: any;

@Component({
    selector: 'app-user-friends',
    templateUrl: './user-friends.component.html',
    styleUrls: ['./user-friends.component.scss'],
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
export class UserFriendsComponent implements OnInit, OnDestroy {
    // variables
    friendsSub: Subscription;
    searchedText;
    toggleArraies = false;
    // arries
    friendsContainer: Friends[] = [];
    filteredFriends: Friends[] = [];
    mutualFriends: MutualFriends[] = [];
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

    constructor(private friends: FreindsDetailsService) {
    }

    ngOnInit(): void {
        this.getAllUserFriends();
    }

    ngOnDestroy(): void {
        this.friendsSub.unsubscribe();
    }

    getAllUserFriends(): void {
        this.friends.showLoader();
        this.friendsSub = this.friends.getUserFriends().subscribe(res => {
            this.friends.hideLoader();
            this.friendsContainer = res.friends;
            console.log(res);
        });
    }

    deleteFriend(id, firstName, lastName): void {
        Swal.fire({
            title: 'Are you sure?',
            text: `Would you like to delete ${firstName} ${lastName}!`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.value) {
                this.friends.delteFriend(id).subscribe(res => {
                    this.getAllUserFriends();
                    Swal.fire(
                        'Deleted!',
                        'Your friend has been deleted.',
                        'success'
                    );
                });
            }
        });

    }

    passMutualData(data): void {
        this.mutualFriends = data;
    }

    searchInFriends(): void {
        if (this.searchedText === undefined) {
            this.toggleArraies = false;
        } else {
            this.toggleArraies = true;
            this.filteredFriends = this.friendsContainer.filter((filtered) => `${filtered.firstName.toLowerCase()} ${filtered.lastName.toLowerCase()}`.includes(this.searchedText.toLowerCase()));
            console.log(this.filteredFriends);
        }
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
