import {Component, OnDestroy, OnInit} from '@angular/core';
import {animate, group, style, transition, trigger} from '@angular/animations';
import {MutualFriends, People} from '../../models/model';
import {Subscription} from 'rxjs';
import {FreindsDetailsService} from '../../Services/friends/freinds-details.service';

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
  // array
  peopleContainer: People[] = [];
  filterdPeople: People[] = [];
  mutualPeople: MutualFriends[] = [];
  // interfaces
  constructor(private people: FreindsDetailsService) { }

  ngOnInit(): void {
    this.getAllPeople();
  }

  ngOnDestroy(): void {
    this.peopleSub.unsubscribe();
  }

  sendFriendReq(id): void {
    this.people.sendFriendReq(id).subscribe(res => {
      console.log(res);
      this.getAllPeople();
    });
  }

  getSelectedPeople(data): void {
    this.mutualPeople = data;
  }
  getAllPeople(): void {
    this.people.showLoader();
    this.peopleSub = this.people.findPeople().subscribe(res => {
      this.people.hideLoader();
      this.peopleContainer = res.people;
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
}
