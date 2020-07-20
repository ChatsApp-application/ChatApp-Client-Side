import { Component, OnInit } from '@angular/core';
import {animate, group, style, transition, trigger} from '@angular/animations';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import validate = WebAssembly.validate;
import {AuthenticationService} from '../../Services/authentication.service';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
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
export class RegisterComponent implements OnInit {
  // variables
  sendRequest = false;
  // form group
  registerForm = new FormGroup({
    firstName: new FormControl('', [Validators.required, Validators.pattern('[a-zA-z ]*'), Validators.minLength(3)]),
    lastName: new FormControl('', [Validators.required, Validators.pattern('[a-zA-z ]*'), Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    country: new FormControl('', [Validators.required, Validators.maxLength(11)]),
    age: new FormControl('', [Validators.required, Validators.pattern('[0-9]{1,2}'), Validators.maxLength(2)]),
    gender: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  constructor(public auth: AuthenticationService) { }

  ngOnInit(): void {
  }

  RegisterUser(): void {

  }
}
