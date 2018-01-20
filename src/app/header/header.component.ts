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

  constructor(private coinservice: CoinService, private router: Router, private flashMessagesService: FlashMessagesService) {
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
    if (login.username == '') {
      this.flashMessagesService.show('Please enter name', { cssClass: 'alert-danger', timeout: 2000 });
    // tslint:disable-next-line:triple-equals
    } else if (login.password == '') {
      this.flashMessagesService.show('Please enter password', { cssClass: 'alert-danger', timeout: 2000 });
    } else {
      this.coinservice.loginuserdata(login)
        .subscribe(resData => {
          // tslint:disable-next-line:triple-equals
          if (resData.status == true) {
            console.log(resData);
            this.flashMessagesService.show(resData.message, { cssClass: 'alert-success', timeout: 2000 });
            localStorage.setItem('login_ses', resData.status);
            localStorage.setItem('id', resData.data.id);
            localStorage.setItem('username', resData.data.username);
            localStorage.setItem('email', resData.data.email);
            localStorage.setItem('entry_date', resData.data.entry_date);
            /* setTimeout(() => {
              location.reload();
            }, 2000); */
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
