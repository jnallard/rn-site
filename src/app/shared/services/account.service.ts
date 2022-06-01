import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, tap } from 'rxjs/operators';
import { SearchResponse } from '../models/search-response.model';
import { ServerInfo } from '../models/server-info.model';
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
    const param = `["f4b0e8bdfb6ca76ab702ee2326df2aaa"]`;
    const urlQueryPath = 'interface=AccountInterface&method=isLoggedIn&short=60411';
    return this.get<string>(urlQueryPath, param).pipe(tap(response => {
      if (response as any == false) throw 'UserId not set'}
    ));
  }

  getMyProfile() {
    const userId = this.settings.userId;
    const param = `[["${userId}"]]`;
    const urlQueryPath = 'interface=ProfileInterface&method=getVCard&short=60411';
    return this.get<any>(urlQueryPath, param).pipe(map(response => {
      const data = response[userId];
      return {
        corpId: data.corporationID,
        homeTownId: data.homeTown
      }
    }));
  }

  getServerInfo() {
    const param = `[]`;
    const urlQueryPath = 'interface=ServerInfoInterface&method=getInfo&short=60411';
    return this.get<{config: string, townNamePackage: string}>(urlQueryPath, param).pipe(map(config => {
      const configName = config.config;
      const configParts = configName.split('/');
      const scenario = configParts[0];
      const speed = configParts[1].replace(/[^a-zA-Z]+/g, '');
      const townNamePackage = config.townNamePackage;
      return {
        scenario,
        speed,
        config,
        townNamePackage,
      } as ServerInfo;
    }));
  }

  getEraInfo() {
    const param = `[]`;
    const urlQueryPath = 'interface=EraInterface&method=getEraInfos&short=60411';
    return this.get<{Era: number, CurrentEraDay: number}>(urlQueryPath, param);
  }

  searchPlayers(searchString: string) {
    const param = `["${searchString}"]`;
    const urlQueryPath = 'interface=AccountInterface&method=getByName&short=96';
    return this.get<{ID: string, name: String}[]>(urlQueryPath, param).pipe(map(players => players.map(player => ({id: player.ID, name: player.name} as SearchResponse))));
  }
}
