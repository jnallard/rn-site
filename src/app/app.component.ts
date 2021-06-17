import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SocketEvent } from './shared/models/socket-event';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  public isCollapsed = true;

  constructor(private router: Router) {
    router.events.subscribe(event => {
      this.isCollapsed = true;
    });
  }

}
