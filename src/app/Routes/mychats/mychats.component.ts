import { Component, OnInit } from '@angular/core';
import {animate, group, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-mychats',
  templateUrl: './mychats.component.html',
  styleUrls: ['./mychats.component.scss'],
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
    ])
  ]
})
export class MychatsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
