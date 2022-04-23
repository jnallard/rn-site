import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { SettingsService } from './settings.service';

@Injectable({
  providedIn: 'root'
})
export abstract class BaseProxyService {

  constructor(private httpClient: HttpClient, protected settings: SettingsService) { }

  get<T>(urlQueryPath: string, param: string) {
    let cookie = this.settings.cookie;
    let server = this.settings.server;
    let fullPath = `/proxy?cookie=${encodeURIComponent(cookie)}&param=${encodeURIComponent(param)}&server=${encodeURIComponent(server)}&urlQueryPath=${encodeURIComponent(urlQueryPath)}`;
    return this.httpClient.get<any>(fullPath).pipe(map(response => response.Body as T));
  } 
}
