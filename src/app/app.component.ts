import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { finalize, mergeMap, tap } from 'rxjs/operators';
import { AccountService } from './shared/services/account.service';
import { SettingsService } from './shared/services/settings.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  public isCollapsed = true;
  public isLoading = false;
  public error: string;

  public cookie = '';
  public server = '';
  public userId = '';

  constructor(router: Router, public settings: SettingsService, private accountService: AccountService) {
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

  ngOnInit(): void {
    if(this.settings.cookie && this.settings.server) {
      this.getUserId();
    }
  }

  setSettings() {
    console.log(this.cookie, this.server);
    this.settings.cookie = this.cookie;
    this.settings.server = this.server;
    this.getUserId();
  }

  getUserId() {
    this.isLoading = true;
    this.error = null;
    this.accountService.getServerInfo().pipe(
      finalize(() => this.isLoading = false),
      tap(serverInfo => this.settings.serverInfo = serverInfo),
      mergeMap(() => this.accountService.getUserId())
    ).subscribe(userId => {
      this.error = null;
      this.settings.userId = userId;
    }, error => {
      this.error = `Failed to get user profile`;
      console.error(error);
    });
  }
}
