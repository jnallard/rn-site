import { Component, OnInit } from '@angular/core';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { map, shareReplay } from 'rxjs/operators';
import { PrestigeFilterType } from '../shared/enums/prestige-filter-type.enum';
import { AccountService } from '../shared/services/account.service';
import { PlayerService } from '../shared/services/player.service';
import { Player } from './player.model';
import { PrestigeHistory } from './prestige-history.model';

interface dataRow {
  name: string, 
  gameRank: number,
  total: number,
  transports: number,
  investments: number,
  competitions: number,
  trainStation: number,
  medals: number,
  misc: number,
}

@Component({
  selector: 'app-player-ranks',
  templateUrl: './player-ranks.component.html',
  styleUrls: ['./player-ranks.component.css']
})
export class PlayerRanksComponent implements OnInit {

  constructor(private playerService: PlayerService, private accountService: AccountService) { }

  players: Player[] = [];
  isLoading = false;
  era: number = null;

  private gridAPI: GridApi;
  rowData: dataRow[] = [];
  prestigeFilter = PrestigeFilterType.AllTime;

  private numberComparator = (valueA, valueB) => valueA - valueB;
  getRankRender(rankProperty: string) {
    return (params: any) => {
      if (!params.value) {
        return '';
      }
      let rank = params.data?.prestige[rankProperty];
      if (rank) {
        return`${params.value} <small class="badge rounded-pill ${this.getRankClass(rank)}">${rank}</small>`;
      }
      return params.value;
    };
  }
  
  defaultColDef = {
    minWidth: 120,
    sortable: true,
    resizable: true,
  } as ColDef;

  columnDefs: ColDef[] = [
    { field: 'gameRank', pinned: true, comparator: this.numberComparator } as ColDef,
    { field: 'name', pinned: true },
    { field: 'total', comparator: this.numberComparator, cellRenderer: this.getRankRender('totalPrestigeRank') },
    { field: 'transports', comparator: this.numberComparator, cellRenderer: this.getRankRender('transportPrestigeRank') },
    { field: 'investments', comparator: this.numberComparator, cellRenderer: this.getRankRender('investmentPrestigeRank') },
    { field: 'competitions', comparator: this.numberComparator, cellRenderer: this.getRankRender('compPrestigeRank') },
    { field: 'trainStation' , comparator: this.numberComparator, cellRenderer: this.getRankRender('trainStationPrestigeRank') },
    { field: 'medals', comparator: this.numberComparator, cellRenderer: this.getRankRender('medalPrestigeRank') },
    { field: 'misc', comparator: this.numberComparator, cellRenderer: this.getRankRender('miscPrestigeRank') },
  ];


  filterOptions = [
    { display: 'All Time', type: PrestigeFilterType.AllTime },
    { display: 'Today', type: PrestigeFilterType.Today },
    { display: 'Yesterday', type: PrestigeFilterType.Yesterday },
  ]

  ngOnInit(): void {
    this.loadData().then();
  }

  async loadData() {
    if (this.era === null) {
      await this.getEra();
    }
    await this.getPlayers();
  }

  async getEra() {
    var eraInfo = await this.accountService.getEraInfo().toPromise();
    this.era = eraInfo.Era;
    switch(this.era) {
      case 6: 
        this.filterOptions.push({ display: 'Endgame', type: PrestigeFilterType.EndGame });
      case 5: 
        this.filterOptions.push({ display: 'Era 6', type: PrestigeFilterType.Era6 });
      case 4: 
        this.filterOptions.push({ display: 'Era 5', type: PrestigeFilterType.Era5 });
      case 3: 
        this.filterOptions.push({ display: 'Era 4', type: PrestigeFilterType.Era4 });
      case 2: 
        this.filterOptions.push({ display: 'Era 3', type: PrestigeFilterType.Era3 });
      case 1: 
        this.filterOptions.push({ display: 'Era 2', type: PrestigeFilterType.Era2 });
      case 0: 
        this.filterOptions.push({ display: 'Era 1', type: PrestigeFilterType.Era1 });
    }
  }

  async getPlayers() {
    this.isLoading = true;
    this.players = [];
    let topPlayers = await this.playerService.getTopPlayers(0, 19).toPromise();
    let profiles = await this.playerService.getUsers(topPlayers.highscore.map(x => x["0"])).toPromise();

    var players = topPlayers.highscore.map(id => {
      const profile = profiles.find(p => p.id === id[0]);
      const player = new Player(profile.name, id[0]);
      this.players.push(player);
      return player;
    });
    for(let player of players) {
      await this.getPlayerPrestige(player);
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    await this.updateRows();
    this.isLoading = false;
  }

  async getPlayerPrestige(player: Player) {
    player.totalPrestige = this.getPrestigeObservable(player, PrestigeFilterType.AllTime);
    player.todayPrestige = this.getPrestigeObservable(player, PrestigeFilterType.Today);
    player.yesterdayPrestige = this.getPrestigeObservable(player, PrestigeFilterType.Yesterday);
    player.era1Prestige = this.getPrestigeObservable(player, PrestigeFilterType.Era1);
    player.era2Prestige = this.getPrestigeObservable(player, PrestigeFilterType.Era2);
    player.era3Prestige = this.getPrestigeObservable(player, PrestigeFilterType.Era3);
    player.era4Prestige = this.getPrestigeObservable(player, PrestigeFilterType.Era4);
    player.era5Prestige = this.getPrestigeObservable(player, PrestigeFilterType.Era5);
    player.era6Prestige = this.getPrestigeObservable(player, PrestigeFilterType.Era6);
    player.endGamePrestige = this.getPrestigeObservable(player, PrestigeFilterType.EndGame);
  }

  private getPrestigeObservable(player: Player, type: PrestigeFilterType) {
    return this.playerService.getPrestigeHistory(player.id, type).pipe(map(p => new PrestigeHistory(p)), shareReplay());
  }

  getFilteredPrestige(player: Player) {
    switch(this.prestigeFilter) {
      case PrestigeFilterType.AllTime:
        return player.totalPrestige;
      case PrestigeFilterType.Today:
        return player.todayPrestige;
      case PrestigeFilterType.Yesterday:
        return player.yesterdayPrestige;
      case PrestigeFilterType.Era1:
        return player.era1Prestige;
      case PrestigeFilterType.Era2:
        return player.era2Prestige;
      case PrestigeFilterType.Era3:
        return player.era3Prestige;
      case PrestigeFilterType.Era4:
        return player.era4Prestige;
      case PrestigeFilterType.Era5:
        return player.era5Prestige;
      case PrestigeFilterType.Era6:
        return player.era6Prestige;
      case PrestigeFilterType.EndGame:
        return player.endGamePrestige;
    }
  }

  getRankClass(rank: number) {
    if(rank == 1) {
      return 'bg-success';
    }
    if(rank == 2) {
      return 'bg-primary';
    }
    if(rank == 3) {
      return 'bg-info';
    }
    if(rank <= 10) {
      return 'bg-secondary';
    }
    return 'bg-light text-dark';
  }

  async updateRows() {
    this.isLoading = true;
    this.rowData = [];
    for (let player of this.players) {
      let fileredPrestigeObservale = this.getFilteredPrestige(player);
      let prestige = await fileredPrestigeObservale?.toPromise();
      let totalPrestige = player.totalPrestige == fileredPrestigeObservale ? prestige : await player.totalPrestige.toPromise();
      if (!prestige) {
        return {} as any;
      }
      this.rowData.push({
        name: player.username,
        gameRank: totalPrestige?.totalPrestigeRank,
        total: prestige.totalPrestige,
        transports: prestige.transportPrestige,
        investments: prestige.investmentPrestige,
        competitions: prestige.compPrestige,
        trainStation: prestige.trainStationPrestige,
        medals: prestige.medalPrestige,
        misc: prestige.miscPrestige,
        prestige,
      } as dataRow);
      this.rowData = this.rowData.slice();
    }
    this.gridAPI?.sizeColumnsToFit();
    this.isLoading = false;
  }

  export() {
    this.gridAPI.exportDataAsCsv({ fileName: 'players.csv' });
  }

  onGridReady(event: GridReadyEvent) {
    this.gridAPI = event.api;
    event.api.sizeColumnsToFit();
  }

}
