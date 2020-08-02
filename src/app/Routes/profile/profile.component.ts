import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {animate, group, style, transition, trigger} from '@angular/animations';
import {ActivatedRoute} from '@angular/router';
import {ProfileService} from '../../Services/profile/profile.service';
import {VisitedProfile} from '../../models/model';
import {FreindsDetailsService} from '../../Services/friends/freinds-details.service';
import Swal from 'sweetalert2';
import {SocketService} from '../../Services/socket-io/socket.service';
import Uikit from 'uikit';
import {Subscription} from 'rxjs';
import {SwiperOptions} from 'swiper';
declare const $: any;
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
export class ProfileComponent implements OnInit, OnDestroy {
    // swiper
    config: SwiperOptions = {
        slidesPerView: 5,
        spaceBetween: 10,
        loop: false,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
        },
        breakpoints: {
            1200: {
                slidesPerView: 5,
                slidesPerGroup: 5
            },
            992: {
                slidesPerView: 4,
                slidesPerGroup: 4
            },
            768: {
                slidesPerView: 3,
                slidesPerGroup: 3
            },
            600: {
                slidesPerView: 2.5,
                slidesPerGroup: 2.5
            },
            450: {
                slidesPerView: 2,
                slidesPerGroup: 2
            },
            320: {
                slidesPerView: 1,
                slidesPerGroup: 1
            }
        }
    };
    // variables
    userId;
    sendRequest = false;
    listenToInformingSub: Subscription;
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
    // interfaces
    userData: VisitedProfile = {
        age: null,
        gender: '',
        firstName: '',
        lastName: '',
        bio: '',
        country: ''
    };
    constructor(private activated: ActivatedRoute, private profile: ProfileService, private friend: FreindsDetailsService, public socket: SocketService) {
        this.activated.params.subscribe(res => {
            this.userId = res.id;
            this.getUserProfile();
        });
        this.listenToProfileChanges();
        this.listenToUnFriendChanges();
    }

    ngOnInit(): void {
        this.listenToInformingNotification();
    }

    ngOnDestroy(): void {
        this.listenToInformingSub.unsubscribe();
    }

    sendAddFriend(id): void {
        this.sendRequest = true;
        this.friend.sendFriendReq(id).subscribe(res => {
            this.getUserProfile();
            this.sendRequest = false;
        });
    }

    getUserProfile(): void {
        this.friend.showLoader();
        this.profile.getData(this.userId).subscribe(res => {
            this.profileContainer = res.user;
            console.log(res);
            this.friend.hideLoader();
        });
    }

    editProfileData(): void {
        this.sendRequest = true;
        console.log(this.userData);
        this.profile.updateProfile(this.userData).subscribe(res => {
            this.sendRequest = false;
            this.getUserProfile();
            this.closeModal();
            this.alertSuccess('Profile Updated');
        }, err => {
            this.sendRequest = false;
            this.alertDanger(`${err.error.error}`);
            console.log(err);
        });
    }

    passUserData(data): void {
        const newEditData = {...data};
        const {firstName, lastName, age, bio, country, gender } = newEditData;
        this.userData = {firstName, lastName, age, bio, country, gender};
        console.log(this.userData);
    }

    profileImageSelected(event): void {
        this.sendRequest = true;
        console.log(event.target.files[0]);
        const profilePicture = new FormData();
        profilePicture.append('image', event.target.files[0], event.target.files[0].name);

        this.profile.updatePP(profilePicture).subscribe(res => {
            this.socket.getUserAfterLoggedIn();
            this.getUserProfile();
            this.sendRequest = false;
            this.alertSuccess('Profile Picture Updated Successfully');
        }, err => {
            this.alertDanger('Something went wrong!');
            console.log(err);
            this.sendRequest = false;
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

    listenToProfileChanges(): void {
        this.socket.listen('informingNotification').subscribe(res => {
            if (res['content'] && this.socket.userContainer._id === res['to'] || this.socket.userContainer._id === res['notification'].fromUser._id) {
                this.getUserProfile();
            }
        });
    }

    listenToUnFriendChanges(): void {
        this.socket.listen('unFriend').subscribe(res => {
            if (this.socket.userContainer._id === res['friendId']) {
                this.getUserProfile();
            }
        });
    }

    listenToInformingNotification(): void {
       this.listenToInformingSub = this.socket.listen('informingNotificationForBoth').subscribe(res => {
            console.log(res);
            if (this.socket.userContainer._id === res['notificationForUser']?.fromUser?._id) {
                this.socket.getUserAfterLoggedIn();
            }
            if (this.socket.userContainer._id === res['notificationForAddTo']?.fromUser?._id) {
                this.socket.getUserAfterLoggedIn();
                this.getUserProfile();
            }
        });
    }

    closeModal(): void {
        Uikit.offcanvas('#edit-profile').hide();
    }
}
