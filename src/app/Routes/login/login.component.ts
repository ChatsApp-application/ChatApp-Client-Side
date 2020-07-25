import { Component, OnInit } from '@angular/core';
import {animate, group, style, transition, trigger} from '@angular/animations';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Login} from '../../models/model';
import Swal from 'sweetalert2';
import {AuthenticationService} from '../../Services/authentication.service';
import {Router} from '@angular/router';
import {SocketService} from '../../Services/socket-io/socket.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
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
export class LoginComponent implements OnInit {
  // variables
  sendRequest = false;
  // form group
  loginForm = new FormGroup({
    userName: new FormControl('', [Validators.required, Validators.pattern('[a-zA-z @.]*'), Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });
  // interfaces
  loginData: Login = {
    email: '',
    password: ''
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
  constructor(private login: AuthenticationService, private router: Router, private socket: SocketService) { }

  ngOnInit(): void {
  }

  loginThisUser(): void {
    this.sendRequest = true;
    this.loginData.email = this.loginForm.controls.userName.value;
    this.loginData.password = this.loginForm.controls.password.value;

    this.login.loginAuth(this.loginData).subscribe(res => {
      this.sendRequest = false;
      this.loginForm.reset();
      this.alertSuccess(`${res.message}`);
      setTimeout(() => {
        this.login.saveToken(res.token);
        window.location.reload();
      }, 2500);
    }, err => {
      this.sendRequest = false;
      this.alertDanger(`${err.error.error}`);
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
}
