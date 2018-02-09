import { Component, OnInit } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Router } from '@angular/router';
import { CoinService } from '../coin.service';
import * as myGlobals from './../global';
import { defer } from 'q';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';
import { URLSearchParams } from '@angular/http';
import { ToasterContainerComponent, ToasterService, ToasterConfig } from 'angular2-toaster';

declare var $;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers: [CoinService],
})
export class ProfileComponent implements OnInit {

  private toasterService: ToasterService;
  allcurrency: any;
  profile = {
    name: '',
    email: '',
    d_currency: '',
  };
  prof = {
    uname: '',
    b_curr: ''
  };

  constructor(private coinservice: CoinService, private router: Router, toasterService: ToasterService) {
    this.toasterService = toasterService;
  }

  ngOnInit() {
    this.coinservice.getprofileupdatedata().subscribe(resData => {
      if (resData.status === true) {
        this.profile = resData.data;
      }
    });
    this.coinservice.getallcurrencylist().subscribe(resData => {
      if (resData.status === true) {
        this.allcurrency = resData.data;
      }
    });
  }

  searchcur = (text$: Observable<string>) =>
    text$
      .debounceTime(200)
      .map(termcur => termcur === '' ? []
        : this.allcurrency.filter(v => v.currency_symbol.toLowerCase().indexOf(termcur.toLowerCase()) > -1).slice(0, 10))

  formattercur = (x: { currency_symbol: string }) => x.currency_symbol;

  onSubmitPrafile() {
    this.prof.uname = $('#unmae').val();
    if (this.prof.uname === '') {
      this.toasterService.pop('error', 'Required', 'Please enter name');
    } else {
      this.coinservice.profileupdate(this.prof).subscribe(resData => {
        if (resData.status === true) {
          this.toasterService.pop('success', 'Success', resData.message);
          setTimeout(() => {
            location.reload();
          }, 1000);
        } else {
          this.toasterService.pop('error', 'Error', resData.message);
        }
      });
    }
  }

}
