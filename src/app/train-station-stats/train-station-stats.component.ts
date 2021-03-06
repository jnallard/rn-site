import { Component, OnInit, ViewChild } from '@angular/core';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { IdsSelectorComponent } from '../shared/components/ids-selector/ids-selector.component';
import { Hotel, LevelData, Restaurant, ShoppingCenter, StaticBuildingData } from '../shared/data/static-building.data';
import { AccountService } from '../shared/services/account.service';
import { BuildingService } from '../shared/services/building.service';
import { CorpService } from '../shared/services/corp.service';
import { PlayerService } from '../shared/services/player.service';
import { SettingsService } from '../shared/services/settings.service';

@Component({
  selector: 'app-train-station-stats',
  templateUrl: './train-station-stats.component.html',
  styleUrls: ['./train-station-stats.component.css'],
})
export class TrainStationStatsComponent implements OnInit {

  _isLoading = true;
  get isLoading() {
    return this._isLoading || !this.idSelector || this.idSelector.isLoading;
  }

  currencyFormatter = (currency, sign) => {
    var sansDec = currency.toFixed(0);
    var formatted = sansDec.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return sign + `${formatted}`;
  };

  @ViewChild(IdsSelectorComponent)
  private idSelector: IdsSelectorComponent;

  userData = new Map<string, any>();
  rowData: any[] = [];

  restaurantPeriod: number;
  shoppingCenterPeriod: number;
  hotelPeriod: number;

  private numberComparator = (valueA, valueB) => (valueA || 0) - (valueB || 0);
  private gridAPI: GridApi;
  columnDefs: ColDef[] = [
    { field: 'user', pinned: true } as ColDef,
    { field: 'corporation', pinned: true },
    { field: 'totalWorkerValue', cellStyle: { 'background-color': '#28a745' }, pinned: true, comparator: this.numberComparator, valueFormatter: params => this.currencyFormatter(params.data.totalWorkerValue, '$') },
  ].concat(StaticBuildingData.AllBuildings.map((b) => ({
    field: b.name, comparator: this.numberComparator,
    cellRenderer: params => {
      if (!params.value) {
        return '';
      }
      const percent = Math.floor(100 * params.value / b.maxLevel);
      return `<p style="background: linear-gradient(90deg, #CCCCCC59 ${percent}%, #00000000 0%);">${params.value}</p>`;
    }
  })))
  .concat([
    { field: 'totalLevels', comparator: this.numberComparator },
    { field: 'prestigeLeft', comparator: this.numberComparator },
    { field: 'dailyMoney', comparator: this.numberComparator, valueFormatter: params => this.currencyFormatter(params.data.dailyMoney, '$') },
    { field: 'dailyPrestige', comparator: this.numberComparator },
    { field: 'workerMoneyBonus', comparator: this.numberComparator, valueFormatter: params => this.currencyFormatter(params.data.workerMoneyBonus, '$') },
    { field: 'workerPrestigeBonus', comparator: this.numberComparator },
  ]);

  defaultColDef = {
    minWidth: 120,
    sortable: true,
    resizable: true,
  } as ColDef;

  constructor(
    private accountService: AccountService,
    private playerService: PlayerService,
    private corpService: CorpService,
    private buildingService: BuildingService,
    private settings: SettingsService,
  ) { }

  ngOnInit(): void {
    this.loadInitialData().then();
  }

  async loadInitialData() {
    const serverInfo = await this.getServerInfo();
    // TODO: Figure out if I can get the period data with a service call. Only 'default' and 'speed' seem like options right now
    switch (serverInfo.speed) {
      case 'speed': // 2x
        this.restaurantPeriod = 45;
        this.shoppingCenterPeriod = 180;
        this.hotelPeriod = 90;
        break;
      default: //1x
        this.restaurantPeriod = 90;
        this.shoppingCenterPeriod = 360;
        this.hotelPeriod = 180;
        break;
    }
    this._isLoading = false;
  }

  async loadData() {
    this._isLoading = true;
    const users = this.idSelector.getSelectedPlayers();

    for (const user of users) {
      const corp = await this.getCorpDetails(user.corpId);
      this.userData.set(user.id, { user: user.name, corporation: corp.name, totalLevels: 0, prestigeLeft: 0, dailyMoney: 0, dailyPrestige: 0, workerMoneyBonus: 0, workerPrestigeBonus: 0, totalWorkerValue: 0 });
    }
    this.updateRows();
    await this.getBuildings(users.map(user => user.id));
    this._isLoading = false;
  }

  async getAccount() {
    return await this.accountService.getMyProfile().toPromise();
  }

  async getServerInfo() {
    return this.settings.serverInfo;
  }

  async getCorpDetails(corpId: string) {
    return await this.corpService.getCorpDetails(corpId).toPromise();
  }

  async getUserNames(userIds: string[]) {
    return await this.playerService.getUsers(userIds).toPromise();
  }

  async getBuildings(userIds: string[]) {
    for (const userId of userIds) {
      const currentData = this.userData.get(userId);
      const buildingLevels = await this.buildingService.getStationBuildings(userId).toPromise();
      for (const buildingLevel of buildingLevels) {
        const building = StaticBuildingData.getBuildingDictionary()[buildingLevel.id];
        if (!building) {
          break;
        }
        currentData[building.name] = buildingLevel.level;
        currentData.totalLevels += buildingLevel.level;
        currentData.prestigeLeft += building.getPrestigeLeft(buildingLevel.level);
      }
      const restaurantLevel = Restaurant.levelData.find(ld => ld.level === currentData[Restaurant.name] as number);
      const shoppingCenterLevel = ShoppingCenter.levelData.find(ld => ld.level === currentData[ShoppingCenter.name] as number);
      const hotelLevel = Hotel.levelData.find(ld => ld.level === currentData[Hotel.name] as number);
      currentData.dailyMoney = this.getDailyBonusMoney(restaurantLevel, shoppingCenterLevel, hotelLevel, false);
      currentData.dailyPrestige = this.getDailyBonusPrestige(hotelLevel, false);
      currentData.workerMoneyBonus = this.getDailyBonusMoney(restaurantLevel, shoppingCenterLevel, hotelLevel, true) - currentData.dailyMoney;
      currentData.workerPrestigeBonus = this.getDailyBonusPrestige(hotelLevel, true) - currentData.dailyPrestige;
      currentData.totalWorkerValue = currentData.workerMoneyBonus + (currentData.workerPrestigeBonus * 10000);

      this.updateRows();
    }
  }

  private getDailyBonusMoney(restaurantLevel: LevelData, shoppingCenterLevel: LevelData, hotelLevel: LevelData, withWorker: boolean) {
    const restaurantPeriodAdjusted = withWorker ? this.restaurantPeriod * 0.60 : this.restaurantPeriod;
    const scPeriodAdjusted = withWorker ? this.shoppingCenterPeriod * 0.60 : this.shoppingCenterPeriod;
    return Restaurant.getDailyBonus(restaurantLevel.level, hotelLevel.multiplier, restaurantPeriodAdjusted) + ShoppingCenter.getDailyBonus(shoppingCenterLevel.level, hotelLevel.multiplier, scPeriodAdjusted);
  }

  private getDailyBonusPrestige(hotelLevel: LevelData, withWorker: boolean) {
    const hotelPeriodAdjusted = withWorker ? this.hotelPeriod * 0.60 : this.hotelPeriod;
    return Hotel.getDailyBonus(hotelLevel.level, 1, hotelPeriodAdjusted);
  }

  updateRows() {
    this.rowData = [...this.userData.values()];
    this.gridAPI.sizeColumnsToFit();
  }

  export() {
    this.gridAPI.exportDataAsCsv({ fileName: 'buildings.csv' });
  }

  onGridReady(event: GridReadyEvent) {
    this.gridAPI = event.api;
    event.api.sizeColumnsToFit();
  }
}
