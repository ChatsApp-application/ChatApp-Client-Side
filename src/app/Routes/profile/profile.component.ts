import {Component, OnInit} from '@angular/core';
import {animate, group, style, transition, trigger} from '@angular/animations';
import {ActivatedRoute} from '@angular/router';
import {ProfileService} from '../../Services/profile/profile.service';
import {VisitedProfile} from '../../models/model';
import {FreindsDetailsService} from '../../Services/friends/freinds-details.service';
import Swal from 'sweetalert2';
@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss'],
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
export class ProfileComponent implements OnInit {
    // variables
    userId;
    sendRequest = false;
    // array
    profileContainer: VisitedProfile = {};
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
    constructor(private activated: ActivatedRoute, private profile: ProfileService, private friend: FreindsDetailsService) {
        this.activated.params.subscribe(res => {
            this.userId = res.id;
            this.getUserProfile();
        });
    }

    ngOnInit(): void {
    }

    sendAddFriend(id): void {
        this.friend.sendFriendReq(id).subscribe(res => {
            this.getUserProfile();
        });
    }

    getUserProfile(): void {
        this.friend.showLoader();
        this.profile.getData(this.userId).subscribe(res => {
            this.profileContainer = res.user;
            console.log(this.profileContainer);
            this.friend.hideLoader();
        });
    }
    profileImageSelected(event): void {
        this.sendRequest = true;
        console.log(event.target.files[0]);
        const profilePicture = new FormData();
        profilePicture.append('image', event.target.files[0], event.target.files[0].name);

        this.profile.updatePP(profilePicture).subscribe(res => {
            this.getUserProfile();
            this.sendRequest = false;
            this.alertSuccess('Profile Picture Updated Successfully');
        }, err => {this.alertDanger('Something went wrong!'); console.log(err); this.sendRequest = false; });
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
