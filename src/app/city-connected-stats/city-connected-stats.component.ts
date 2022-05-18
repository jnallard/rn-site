import { Component, OnInit } from '@angular/core';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { StaticCityData } from '../shared/data/static-city.data';
import { AccountService } from '../shared/services/account.service';
import { CityService } from '../shared/services/city.service';
import { CorpService } from '../shared/services/corp.service';
import { PlayerService } from '../shared/services/player.service';

@Component({
  selector: 'app-city-connected-stats',
  templateUrl: './city-connected-stats.component.html',
  styleUrls: ['./city-connected-stats.component.css'],
})
export class CityConnectedStatsComponent implements OnInit {
  myCorpId = '';

  isLoading = true;
  corpSelection = 'mine';

  cities = StaticCityData.AllCities.slice();
  cityData = new Map<string, any>();
  rowData: any[] = [];

  restaurantPeriod: number;
  shoppingCenterPeriod: number;
  hotelPeriod: number;

  private numberComparator = (valueA, valueB) => valueA - valueB;
  private gridAPI: GridApi;
  columnDefs: ColDef[] = [
    { field: 'city', pinned: true, maxWidth: 150 } as ColDef,
    { field: 'totalConnected', pinned: true, filter: 'agNumberColumnFilter', maxWidth: 150, headerName: "# Connected" },
    { field: 'connected' },
    { field: 'notConnected' }];

  defaultColDef = {
    minWidth: 150,
    sortable: true,
    resizable: true,
    filter: true,
  } as ColDef;

  constructor(
    private accountService: AccountService,
    private playerService: PlayerService,
    private corpService: CorpService,
    private cityService: CityService,
  ) { }

  ngOnInit(): void {
    this.cities.sort((cityA, cityB) => cityA.name.localeCompare(cityB.name));
    this.loadInitialData().then();
  }

  async loadInitialData() {
    const account = await this.getAccount();
    this.myCorpId = account.corpId;
    this.isLoading = false;
  }

  async loadData() {
    this.isLoading = true;
    let corpId = this.myCorpId;

    const corp = await this.getCorpDetails(corpId);
    const userIds = corp.members;
    const users = await this.getUserNames(userIds);
    for (const city of this.cities) {
      this.cityData.set(city.id, { city: city.name, totalConnected: 0, connected: [], notConnected: [] });
    }
    this.updateRows();
    await this.getCities(users);
    this.isLoading = false;
  }

  async getAccount() {
    return await this.accountService.getMyProfile().toPromise();
  }

  async getCorpDetails(corpId: string) {
    return await this.corpService.getCorpDetails(corpId).toPromise();
  }

  async getUserNames(userIds: string[]) {
    return await this.playerService.getUsers(userIds).toPromise();
  }

  async getCities(users: {id: string, name: string}[]) {
    for (const user of users) {
      const userId = user.id;
      const userName = user.name;

      const cityIds = await this.cityService.getCityIDs(userId).toPromise();
      for (const cityId of cityIds) {
        const currentData = this.cityData.get(cityId);
        currentData.totalConnected += 1;
        currentData.connected.push(userName);
      }

      const missingCities = this.cities.filter(city => !cityIds.includes(city.id));
      for (const missingCity of missingCities) {
        const currentData = this.cityData.get(missingCity.id);
        currentData.notConnected.push(userName);
      }

      this.updateRows();
    }
  }

  updateRows() {
    this.rowData = [...this.cityData.values()];
    this.gridAPI.sizeColumnsToFit();
  }

  export() {
    this.gridAPI.exportDataAsCsv({ fileName: 'conenected-cities.csv' });
  }

  onGridReady(event: GridReadyEvent) {
    this.gridAPI = event.api;
    event.api.sizeColumnsToFit();
  }
}
