import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { CoinService } from '../coin.service';
import * as myGlobals from './../global';
import { ToasterContainerComponent, ToasterService, ToasterConfig } from 'angular2-toaster';
import { AuthService } from 'angular4-social-login';
import { SocialUser } from 'angular4-social-login';
import { FacebookLoginProvider, GoogleLoginProvider } from 'angular4-social-login';
import { defer } from 'q';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';
import { window } from 'rxjs/operator/window';

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
  public basecurr: any = myGlobals.basecurr;
  public base_sing: any = myGlobals.base_sing;
  public login_ses: any = 0;
  currencylist: any;
  private user: SocialUser;
  private loggedIn: boolean;
  public model: any;
  public forgot: any;
  regex: any;
  allcoin: any;

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

    if (this.basecurr == null) {
      localStorage.setItem('base', 'USD');
      localStorage.setItem('base_sing', '$');
      this.basecurr = 'USD';
    } else {
      localStorage.setItem('base', this.basecurr);
      localStorage.setItem('base_sing', this.base_sing);
    }
    this.regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    // tslint:disable-next-line:triple-equals
    if (this.loginData == null) {
      this.login_ses = 1;
    } else {
      this.login_ses = 0;
    }
  }

  ngOnInit() {
    this.coinservice.getallcurrencylist().subscribe(resData => {
      if (resData.status === true) {
        this.currencylist = resData.data;
      }
    });
    this.coinservice.getallcoin('').subscribe(resData => {
      if (resData.status === true) {
        this.allcoin = resData.data;
      }
    });
  }

  search = (text$: Observable<string>) =>
    text$
      .debounceTime(200)
      .map(term => term === '' ? []
        : this.allcoin.filter(v => v.id.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))

  formattersearch = (x: { name: string, symbol: string }) => x.name + ' (' + x.symbol + ')';

  keyDownFunction(event) {
    if (event.keyCode === 13) {
      location.href = this.urlString + 'coin/' + this.model.id;
    }
  }

  signInWithGoogle() {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
    this.authService.authState.subscribe((user) => {
      this.user = user;
      this.loggedIn = (user != null);
      if (this.user != null) {
        this.coinservice.sociallogin(this.user).subscribe(resData => {
          if (resData.status === true) {
            this.toasterService.pop('success', 'Success', resData.message);
            localStorage.setItem('login_ses', resData.status);
            localStorage.setItem('id', resData.data.id);
            localStorage.setItem('email', resData.data.email);
            localStorage.setItem('name', resData.data.name);
            localStorage.setItem('usertype', resData.data.usertype);
            localStorage.setItem('status', resData.data.status);
            localStorage.setItem('base', resData.data.d_currency);
            localStorage.setItem('user_base', resData.data.d_currency);
            setTimeout(() => {
              location.reload();
            }, 1000);
          } else {
            this.toasterService.pop('error', 'Error', 'Something went wrong please try after sometime !');
          }
        });
      }
    });
  }

  signInWithFB() {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
    this.authService.authState.subscribe((user) => {
      this.user = user;
      this.loggedIn = (user != null);
      if (this.user != null) {
        this.coinservice.sociallogin(this.user).subscribe(resData => {
          if (resData.status === true) {
            this.toasterService.pop('success', 'Success', resData.message);
            localStorage.setItem('login_ses', resData.status);
            localStorage.setItem('id', resData.data.id);
            localStorage.setItem('email', resData.data.email);
            localStorage.setItem('name', resData.data.name);
            localStorage.setItem('usertype', resData.data.usertype);
            localStorage.setItem('status', resData.data.status);
            localStorage.setItem('base', resData.data.d_currency);
            localStorage.setItem('user_base', resData.data.d_currency);
            setTimeout(() => {
              location.reload();
            }, 1000);
          } else {
            this.toasterService.pop('error', 'Error', 'Something went wrong please try after sometime !');
          }
        });
      }
    });
  }

  onSubmitLogin() {
    if (this.login.email === '') {
      this.toasterService.pop('error', 'Required', 'Please enter email');
    } else if (this.login.email.length === 0 || !this.regex.test(this.login.email)) {
      this.toasterService.pop('error', 'Required', 'Please enter valid email');
    } else if (this.login.password === '') {
      this.toasterService.pop('error', 'Required', 'Please enter password');
    } else {
      this.coinservice.loginuserdata(this.login).subscribe(resData => {
        if (resData.status === true) {
          this.toasterService.pop('success', 'Success', resData.message);
          localStorage.setItem('login_ses', resData.status);
          localStorage.setItem('id', resData.data.id);
          localStorage.setItem('email', resData.data.email);
          localStorage.setItem('name', resData.data.name);
          localStorage.setItem('usertype', resData.data.usertype);
          localStorage.setItem('status', resData.data.status);
          localStorage.setItem('base', resData.data.d_currency);
          localStorage.setItem('user_base', resData.data.d_currency);
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
    if (this.register.username === '') {
      this.toasterService.pop('error', 'Required', 'Please enter name');
    } else if (this.register.useremail === '') {
      this.toasterService.pop('error', 'Required', 'Please enter email');
    } else if (this.register.useremail.length === 0 || !this.regex.test(this.register.useremail)) {
      this.toasterService.pop('error', 'Required', 'Please enter valid email');
    } else if (this.register.userpass === '') {
      this.toasterService.pop('error', 'Required', 'Please enter password');
    } else {
      this.coinservice.newuserregister(this.register).subscribe(resData => {
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

  onSubmitforgotpassword() {
    if (this.forgot === '' || this.forgot === undefined) {
      this.toasterService.pop('error', 'Required', 'Please enter email');
    } else {
      this.coinservice.forgotpassword(this.forgot).subscribe(resData => {
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
    location.href = this.urlString;
  }

  closeNav(basecur, base_sing) {
    localStorage.setItem('base', basecur);
    localStorage.setItem('base_sing', base_sing);
    location.reload();
  }

  isImage(src) {
    const deferred = defer();
    const image = new Image();
    image.onerror = function () {
      deferred.resolve(false);
    };
    image.onload = function () {
      deferred.resolve(true);
    };
    image.src = src;
    return deferred.promise;
  }

  errorHandler(event, name) {
    const imgurl = 'assets/currency-25/' + name.toLowerCase() + '.png';
    this.isImage(imgurl).then(function (test) {
      // tslint:disable-next-line:triple-equals
      if (test == true) {
        return event.target.src = imgurl;
      } else {
        return event.target.src = 'assets/currency-50/not-found-25.png';
      }
    });
  }
}
