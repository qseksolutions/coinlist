import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html'
})
export class AppComponent {

  showHeader: any;
  public location = '';
  constructor(private router: Router) {
  }

  ngOnInit() {
    // listenging to routing navigation event
    this.router.events.subscribe(event => this.modifyHeader(event));
  }

  modifyHeader(location) {
    if (location.url === '/login' || location.url === '/signup' || location.url === '/list') {
      this.showHeader = false;
    } else {
      this.showHeader = true;
    }
  }
}
