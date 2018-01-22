import { Component, OnInit } from '@angular/core';
import * as myGlobals from './../global';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  public urlString: any = myGlobals.base_url;

  constructor() { }

  ngOnInit() {
  }

}
