import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CoinService } from '../coin.service';
import * as myGlobals from './../global';
import { ToasterContainerComponent, ToasterService, ToasterConfig } from 'angular2-toaster';
import { defer } from 'q';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';
import { window } from 'rxjs/operator/window';

declare var $;

@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.css'],
  providers: [CoinService],
})
export class SupportComponent implements OnInit {

  private toasterService: ToasterService;

  public toasterconfig: ToasterConfig =
    new ToasterConfig({
      showCloseButton: true,
      tapToDismiss: false,
      timeout: 2000
    });

  public urlString: any = myGlobals.base_url;
  allcategory: any;
  allquestion: any;
  public category: any;
  public selectedIndex: any = 1;
  public modelfaq: any = 1;

  constructor(private coinservice: CoinService, private router: Router, toasterService: ToasterService) {
    this.toasterService = toasterService;
  }

  ngOnInit() {
    this.coinservice.questionlist().subscribe(resData => {
      if (resData.status === true) {
        this.allquestion = resData.data;
      }
    });
    this.coinservice.categorylist().subscribe(resData => {
      if (resData.status === true) {
        this.allcategory = resData.data;
      }
    });
  }

  search = (text$: Observable<string>) =>
    text$
      .debounceTime(200)
      .map(term => term === '' ? []
        : this.allquestion.filter(v => v.question.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))

  formatterfaq = (x: { question: string }) => x.question;

  toggleClass(index) {
    // tslint:disable-next-line:triple-equals
    if (this.selectedIndex == index) {
    } else {
      this.selectedIndex = index;
    }
  }

}
