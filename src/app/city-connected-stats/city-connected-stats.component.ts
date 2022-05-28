import { Component, OnInit, ViewChild } from '@angular/core';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { IdsSelectorComponent } from '../shared/components/ids-selector/ids-selector.component';
import { StaticCityData } from '../shared/data/static-city.data';
import { CityService } from '../shared/services/city.service';

@Component({
  selector: 'app-city-connected-stats',
  templateUrl: './city-connected-stats.component.html',
  styleUrls: ['./city-connected-stats.component.css'],
})
export class CityConnectedStatsComponent implements OnInit {

  _isLoading = true;
  get isLoading() {
    return this._isLoading || !this.idSelector || this.idSelector.isLoading;
  }
  
  @ViewChild(IdsSelectorComponent)
  private idSelector: IdsSelectorComponent;

  cities = StaticCityData.AllCities.slice();
  cityData = new Map<string, any>();
  rowData: any[] = [];

  restaurantPeriod: number;
  shoppingCenterPeriod: number;
  hotelPeriod: number;

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
    private cityService: CityService,
  ) { }

  ngOnInit(): void {
    this.cities.sort((cityA, cityB) => cityA.name.localeCompare(cityB.name));
    this.loadInitialData().then();
  }

  async loadInitialData() {
    this._isLoading = false;
  }

  async loadData() {
    this._isLoading = true;
    const users = this.idSelector.getSelectedPlayers();
    for (const city of this.cities) {
      this.cityData.set(city.id, { city: city.name, totalConnected: 0, connected: [], notConnected: [] });
    }
    this.updateRows();
    await this.getCities(users);
    this._isLoading = false;
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
    this.gridAPI.exportDataAsCsv({ fileName: 'connected-cities.csv' });
  }

  onGridReady(event: GridReadyEvent) {
    this.gridAPI = event.api;
    event.api.sizeColumnsToFit();
  }
}
