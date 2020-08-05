import {Component, OnDestroy, OnInit} from '@angular/core';
import {animate, group, style, transition, trigger} from '@angular/animations';
import {MutualFriends, People} from '../../models/model';
import {Subscription} from 'rxjs';
import {FreindsDetailsService} from '../../Services/friends/freinds-details.service';
import {SocketService} from '../../Services/socket-io/socket.service';
import Uikit from 'uikit';
@Component({
  selector: 'app-find-people',
  templateUrl: './find-people.component.html',
  styleUrls: ['./find-people.component.scss'],
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
          opacity : 0,
          transform : 'translateY(-50%)'
        }), group([
          animate(250, style({
            opacity : 1
          })), animate(250, style({
            transform : 'translateY(0)'
          }))
        ])
      ])
    ])
  ]
})
export class FindPeopleComponent implements OnInit, OnDestroy {
  // variables
  peopleSub: Subscription;
  searchedText;
  toggleArraies = false;
  listenToInformingSub: Subscription;
  // array
  peopleContainer: People[] = [];
  filterdPeople: People[] = [];
  mutualPeople: MutualFriends[] = [];
  // interfaces
  constructor(private people: FreindsDetailsService, public socket: SocketService) {
    this.listenToFriendsChanges();
    this.listenToUnFriendChanges();
  }

  ngOnInit(): void {
    this.listenToInformingNotification();
    this.getAllPeople();
  }

  ngOnDestroy(): void {
    this.peopleSub.unsubscribe();
    this.listenToInformingSub.unsubscribe();
  }

  sendFriendReq(id, i): void {
    this.peopleContainer[i].sendRequest = true;
    this.people.sendFriendReq(id).subscribe(res => {
      console.log(res);
      this.getAllPeople();
      this.peopleContainer[i].sendRequest = false;
    });
  }

  getSelectedPeople(data): void {
    this.mutualPeople = data;
  }

  listenToFriendsChanges(): void {
    this.socket.listen('informingNotification').subscribe(res => {
      // check if the opposite user accept the friend request
      if (res['content'] && this.socket.userContainer._id === res['to'] || this.socket.userContainer._id === res['notification'].fromUser._id) {
        this.getAllPeople();
      }
    });
  }

  listenToUnFriendChanges(): void {
    this.socket.listen('unFriend').subscribe(res => {
      if (this.socket.userContainer._id === res['friendId']) {
        this.getAllPeople();
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
        this.getAllPeople();
      }
    });
  }
  getAllPeople(): void {
    this.people.showLoader();
    this.peopleSub = this.people.findPeople().subscribe(res => {
      this.people.hideLoader();
      this.peopleContainer = res.people;
      this.peopleContainer.forEach(person => person.sendRequest = false );
      console.log(this.peopleContainer);
    });
  }

  searchInPeople(): void {
    if (this.searchedText === undefined) {
      this.toggleArraies = false;
    } else {
      this.toggleArraies = true;
      this.filterdPeople = this.peopleContainer.filter((filtered) => `${filtered.firstName.toLowerCase()} ${filtered.lastName.toLowerCase()}`.includes(this.searchedText.toLowerCase()));
      console.log(this.filterdPeople);
    }
  }

  closeMe(): void {
    Uikit.modal('#modal-overflow').hide();
  }
}
