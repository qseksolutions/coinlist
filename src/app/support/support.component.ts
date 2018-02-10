import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { CoinService } from '../coin.service';
import * as myGlobals from './../global';
import { ToasterContainerComponent, ToasterService, ToasterConfig } from 'angular2-toaster';
import { defer } from 'q';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';
import { window } from 'rxjs/operator/window';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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

  form: FormGroup;

  @ViewChild('fileInput') fileInput: ElementRef;

  public urlString: any = myGlobals.base_url;
  allcategory: any;
  allquestion: any;
  regex: any;
  public category: any;
  public selectedIndex: any = 1;
  public modelfaq: any = 1;
  image: any;

  contact = {
    cname: '',
    cemail: '',
    subject: '',
    image: '',
    message: '',
  };

  constructor(private coinservice: CoinService, private router: Router, toasterService: ToasterService, private fb: FormBuilder) {
    this.toasterService = toasterService;
    this.createForm();
    this.image = '';
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

  createForm() {
    this.form = this.fb.group({
      cname: ['', Validators.required],
      cemail: ['', Validators.required],
      subject: ['', Validators.required],
      message: ['', Validators.required],
      avatar: null
    });
  }

  onFileChange(event) {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.image = reader.result;
        console.log(this.image);
      };
    }
  }

  onSubmit() {
    const formModel = this.form.value;
    this.regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if (formModel.cname === '') {
      this.toasterService.pop('error', 'Required', 'Please enter name');
    } else if (formModel.cemail === '') {
      this.toasterService.pop('error', 'Required', 'Please enter email');
    } else if (formModel.cemail.length === 0 || !this.regex.test(formModel.cemail)) {
      this.toasterService.pop('error', 'Required', 'Please enter valid email');
    } else if (formModel.subject === '') {
      this.toasterService.pop('error', 'Required', 'Please enter subject');
    } else if (this.image === '') {
      this.toasterService.pop('error', 'Required', 'Please enter image');
    } else if (formModel.message === '') {
      this.toasterService.pop('error', 'Required', 'Please enter message');
    } else {
      setTimeout(() => {
        console.log(formModel);
        this.image = this.image.replace(/\+/g, '#');
        this.coinservice.addcontactus(formModel, this.image).subscribe(resData => {
          if (resData.status === true) {
            this.toasterService.pop('success', 'Success', resData.message);
            setTimeout(() => {
              location.reload();
            }, 1000);
          } else {
            this.toasterService.pop('error', 'Required', 'Something went wrong please try after sometime !');
          }
        });
      }, 1000);
    }
  }

  /* onSubmitSendQuery() {
    console.log(this.contact);
  } */

}
