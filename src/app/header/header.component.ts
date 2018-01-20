import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CoinService } from '../coin.service';
import * as myGlobals from './../global';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  providers: [CoinService],
})
export class HeaderComponent implements OnInit {

  public urlString: any = myGlobals.base_url;
  public login_ses: any = 0;
  regex: any;

  constructor(private coinservice: CoinService, private router: Router, private flashMessagesService: FlashMessagesService) {
    this.regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    const loginData = localStorage.getItem('login_ses');
    const loginDataid = localStorage.getItem('id');
    // tslint:disable-next-line:triple-equals
    if (loginData == null) {
      this.login_ses = 1;
    } else {
      this.login_ses = 0;
    }
  }

  ngOnInit() {
  }

  onSubmitLogin(login) {
    // tslint:disable-next-line:triple-equals
    if (login.email == '') {
      this.flashMessagesService.show('Please enter email', { cssClass: 'alert-danger', timeout: 2000 });
      // tslint:disable-next-line:triple-equals
    } else if (login.email.length == 0 || !this.regex.test(login.email)) {
      this.flashMessagesService.show('Please enter valid email', { cssClass: 'alert-danger', timeout: 2000 });
      // tslint:disable-next-line:triple-equals
    } else if (login.password == '') {
      this.flashMessagesService.show('Please enter password', { cssClass: 'alert-danger', timeout: 2000 });
    } else {
      this.coinservice.loginuserdata(login)
        .subscribe(resData => {
          // tslint:disable-next-line:triple-equals
          if (resData.status == true) {
            // console.log(resData);
            this.flashMessagesService.show(resData.message, { cssClass: 'alert-success', timeout: 2000 });
            localStorage.setItem('login_ses', resData.status);
            localStorage.setItem('email', resData.data.email);
            localStorage.setItem('name', resData.data.name);
            localStorage.setItem('usertype', resData.data.usertype);
            localStorage.setItem('status', resData.data.status);
            setTimeout(() => {
              location.reload();
            }, 2000);
          } else {
            this.flashMessagesService.show(resData.message, { cssClass: 'alert-danger', timeout: 2000 });
          }
        });
    }
  }

  onSubmitRegister(register) {
    // tslint:disable-next-line:triple-equals
    if (register.username == '') {
      this.flashMessagesService.show('Please enter name', { cssClass: 'alert-danger', timeout: 2000 });
      // tslint:disable-next-line:triple-equals
    } else if (register.email == '') {
      this.flashMessagesService.show('Please enter email', { cssClass: 'alert-danger', timeout: 2000 });
      // tslint:disable-next-line:triple-equals
    } else if (register.email.length == 0 || !this.regex.test(register.email)) {
      this.flashMessagesService.show('Please enter valid email', { cssClass: 'alert-danger', timeout: 2000 });
      // tslint:disable-next-line:triple-equals
    } else if (register.password == '') {
      this.flashMessagesService.show('Please enter password', { cssClass: 'alert-danger', timeout: 2000 });
    } else {
      this.coinservice.newuserregister(register)
        .subscribe(resData => {
          // tslint:disable-next-line:triple-equals
          if (resData.status == true) {
            this.flashMessagesService.show(resData.message, { cssClass: 'alert-success', timeout: 2000 });
            setTimeout(() => {
              location.reload();
            }, 2000);
          } else {
            this.flashMessagesService.show(resData.message, { cssClass: 'alert-danger', timeout: 2000 });
          }
        });
    }
  }

  destroyUser() {
    localStorage.clear();
    window.location.href = this.urlString;
  }

}
