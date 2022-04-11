import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
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

  constructor(router: Router, public settings: SettingsService) {
    router.events.subscribe(event => {
      this.isCollapsed = true;
      if(event instanceof NavigationStart && location.hash) {
        var params = new URLSearchParams(location.hash.substring(1));
        params.forEach(a => console.log(a)) ;

        if(params.has('server')) {
          this.server = params.get('server');
        }

        if(params.has('cookie')) {
          this.cookie = atob(params.get('cookie'));
        }
        this.setSettings();
      }
    });
  }

  setSettings() {
    console.log(this.cookie, this.server);
    this.settings.cookie = this.cookie;
    this.settings.server = this.server;
  }
}
