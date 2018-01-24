import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { CoinService } from '../coin.service';
import * as myGlobals from './../global';
import { ToasterContainerComponent, ToasterService, ToasterConfig } from 'angular2-toaster';
import { AuthService } from 'angular4-social-login';
import { SocialUser } from 'angular4-social-login';
import { FacebookLoginProvider, GoogleLoginProvider } from 'angular4-social-login';

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
  public loginData: any = myGlobals.login_ses;
  public login_ses: any = 0;
  currencylist: any ;
  private user: SocialUser;
  private loggedIn: boolean;
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
  constructor(private coinservice: CoinService, private router: Router, toasterService: ToasterService, private authService: AuthService) {
    this.toasterService = toasterService;
    this.regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    // tslint:disable-next-line:triple-equals
    if (this.loginData == null) {
      this.login_ses = 1;
    } else {
      this.login_ses = 0;
    }
  }

  ngOnInit() {
    /* this.coinservice.getallcurrencylist()
      .subscribe(resData => {
        if (resData.status === true) {
          console.log(resData);
          this.currencylist = resData.data;
        }
      }); */
    this.authService.authState.subscribe((user) => {
      this.user = user;
      console.log(this.user);
      this.loggedIn = (user != null);
    });
  }

  signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  signInWithFB(): void {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
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
          // console.log(resData);
          // tslint:disable-next-line:triple-equals
          if (resData.status == true) {
            this.toasterService.pop('success', 'Success', resData.message);
            localStorage.setItem('login_ses', resData.status);
            localStorage.setItem('id', resData.data.id);
            localStorage.setItem('email', resData.data.email);
            localStorage.setItem('name', resData.data.name);
            localStorage.setItem('usertype', resData.data.usertype);
            localStorage.setItem('status', resData.data.status);
            setTimeout(() => {
              location.reload();
            }, 1000);
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
    this.authService.signOut();
    localStorage.clear();
    window.location.href = this.urlString;
  }

}
