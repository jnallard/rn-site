import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { BaseProxyService } from './base-proxy.service';
import { SettingsService } from './settings.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService extends BaseProxyService {

  constructor(httpClient: HttpClient, settings: SettingsService) {
    super(httpClient, settings);
  }

  getUserId() {
    let param = `["f4b0e8bdfb6ca76ab702ee2326df2aaa"]`;
    let urlQueryPath = 'interface=AccountInterface&method=isLoggedIn&short=60411';
    return this.get<string>(urlQueryPath, param).pipe(tap(response => {
      if (response as any == false) throw 'UserId not set'}
    ));
  }
}
