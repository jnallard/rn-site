import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  get cookie(): string {
    return localStorage.getItem('rn-cookie') ?? '';
  }
  set cookie(value: string) {
    localStorage.setItem('rn-cookie', value);
  }

  get server(): string {
    return localStorage.getItem('rn-server') ?? '';
  }
  set server(value: string) {
    localStorage.setItem('rn-server', value);
  }

  userId: string;

  constructor() { }
}
