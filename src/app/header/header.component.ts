import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { CoinService } from '../coin.service';
import * as myGlobals from './../global';
import { ToasterContainerComponent, ToasterService, ToasterConfig } from 'angular2-toaster';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  providers: [CoinService],
})
export class HeaderComponent implements OnInit {

  private toasterService: ToasterService;

  public toasterconfig: ToasterConfig =
    new ToasterConfig({
      showCloseButton: true,
      tapToDismiss: false,
      timeout: 2000
    });

  public urlString: any = myGlobals.base_url;
  public login_ses: any = 0;
  regex: any;
  login = {
    email: '',
    password: ''
  };
  register = {
    username: '',
    useremail: '',
    userpass: ''
  };

  // tslint:disable-next-line:max-line-length
  constructor(private coinservice: CoinService, private router: Router, toasterService: ToasterService) {
    this.toasterService = toasterService;
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
    this.coinservice.getList()
      .subscribe(resData => {
        console.log(resData);
      });
  }

  onSubmitLogin() {
    // tslint:disable-next-line:triple-equals
    if (this.login.email == '') {
      this.toasterService.pop('error', 'Required', 'Please enter email');
      // tslint:disable-next-line:triple-equals
    } else if (this.login.email.length == 0 || !this.regex.test(this.login.email)) {
      this.toasterService.pop('error', 'Required', 'Please enter valid email');
      // tslint:disable-next-line:triple-equals
    } else if (this.login.password == '') {
      this.toasterService.pop('error', 'Required', 'Please enter password');
    } else {
      this.coinservice.loginuserdata(this.login)
        .subscribe(resData => {
          console.log(resData);
          // tslint:disable-next-line:triple-equals
          if (resData.status == true) {
            this.toasterService.pop('success', 'Success', resData.message);
            localStorage.setItem('login_ses', resData.status);
            localStorage.setItem('email', resData.data.email);
            localStorage.setItem('name', resData.data.name);
            localStorage.setItem('usertype', resData.data.usertype);
            localStorage.setItem('status', resData.data.status);
            setTimeout(() => {
              location.reload();
            }, 2000);
          } else {
            this.toasterService.pop('error', 'Error', resData.message);
          }
        });
    }
  }

  onSubmitRegister() {
    // tslint:disable-next-line:triple-equals
    if (this.register.username == '') {
      this.toasterService.pop('error', 'Required', 'Please enter name');
      // tslint:disable-next-line:triple-equals
    } else if (this.register.useremail == '') {
      this.toasterService.pop('error', 'Required', 'Please enter email');
      // tslint:disable-next-line:triple-equals
    } else if (this.register.useremail.length == 0 || !this.regex.test(this.register.useremail)) {
      this.toasterService.pop('error', 'Required', 'Please enter valid email');
      // tslint:disable-next-line:triple-equals
    } else if (this.register.userpass == '') {
      this.toasterService.pop('error', 'Required', 'Please enter password');
    } else {
      this.coinservice.newuserregister(this.register)
        .subscribe(resData => {
          // tslint:disable-next-line:triple-equals
          if (resData.status == true) {
            this.toasterService.pop('success', 'Success', resData.message);
            setTimeout(() => {
              location.reload();
            }, 2000);
          } else {
            this.toasterService.pop('error', 'Error', resData.message);
          }
        });
    }
  }

  destroyUser() {
    localStorage.clear();
    window.location.href = this.urlString;
  }

}
