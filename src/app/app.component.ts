import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SettingsService } from './shared/services/settings.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  public isCollapsed = true;
  public cookie = '';
  public server = '';

  constructor(private router: Router, public settings: SettingsService) {
    router.events.subscribe(event => {
      this.isCollapsed = true;
    });
  }

  setSettings() {
    console.log(this.cookie, this.server);
    this.settings.cookie = this.cookie;
    this.settings.server = this.server;
  }
}
