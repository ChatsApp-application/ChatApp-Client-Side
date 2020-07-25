import { Component, OnInit } from '@angular/core';
import {animate, group, style, transition, trigger} from '@angular/animations';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import validate = WebAssembly.validate;
import {AuthenticationService} from '../../Services/authentication.service';
import {SignUp} from '../../models/model';
import Swal from 'sweetalert2';
import {Router} from '@angular/router';
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
    email: new FormControl('', [Validators.required, Validators.email, Validators.pattern('[a-zA-z @.]*')]),
    country: new FormControl('', [Validators.required, Validators.maxLength(11)]),
    age: new FormControl('', [Validators.required, Validators.pattern('[0-9]{1,2}'), Validators.maxLength(2)]),
    gender: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });
  // interfaces
  signUpData: SignUp = {
    age: null,
    email: '',
    firstName: '',
    lastName: '',
    gender: '',
    password: '',
    country: '',
  };
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
  constructor(public auth: AuthenticationService, private router: Router) { }

  ngOnInit(): void {
  }

  RegisterUser(): void {
    this.sendRequest = true;
    this.signUpData.age = this.registerForm.controls.age.value;
    this.signUpData.email = this.registerForm.controls.email.value;
    this.signUpData.firstName = this.registerForm.controls.firstName.value;
    this.signUpData.lastName = this.registerForm.controls.lastName.value;
    this.signUpData.gender = this.registerForm.controls.gender.value;
    this.signUpData.password = this.registerForm.controls.password.value;
    this.signUpData.country = this.registerForm.controls.country.value;

    this.auth.registerAuth(this.signUpData).subscribe(res => {
      this.sendRequest = false;
      this.alertSuccess(`${res.message}`);
      this.registerForm.reset();
      setTimeout(() => {
        if (localStorage.getItem('chatsapp-token') === null) {
          this.router.navigate(['/login']);
        }
      }, 2500);
    }, err => {this.sendRequest = false; this.alertDanger(`${err.error.error}`); });
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
