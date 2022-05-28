import { Component } from '@angular/core';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { CompService } from '../shared/services/comp.service';

@Component({
  selector: 'app-competitions',
  templateUrl: './competitions.component.html',
  styleUrls: ['./competitions.component.css'],
})
export class CompetitionsComponent {

  _isLoading = true;
  get isLoading() {
    return this._isLoading;
  }

  rowData: any[] = [];

  currencyFormatter = (currency, sign) => {
    var sansDec = currency.toFixed(0);
    var formatted = sansDec.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return sign + `${formatted}`;
  };

  getTimeRemaining = (time: Date) => {
    const timeSeconds = (time.getTime() - new Date().getTime()) / 1000;
    if(timeSeconds < 0) {
      return '';
    }
    const hours = Math.floor(timeSeconds / 3600);
    const minutes = Math.floor((timeSeconds % 3600)/60);
    const seconds=Math.floor(timeSeconds % 60);
    return `${hours}:${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
  };

  timeFormatter = (time: Date) => {
    return time.toLocaleTimeString();
  };

  durationFormatter = (timeSeconds: number) => {
    return `${timeSeconds / 60}m`;
  };

  private gridAPI: GridApi;
  columnDefs: ColDef[] = [
    { field: 'city' } as ColDef,
    { field: 'resource' },
    { field: 'startTime', filter: 'agNumberColumnFilter', valueFormatter: params => this.timeFormatter(params.data.startTime) },
    { field: 'startsIn', filter: 'agNumberColumnFilter', valueFormatter: params => this.getTimeRemaining(params.data.startsIn) },
    { field: 'duration', filter: 'agNumberColumnFilter', valueFormatter: params => this.durationFormatter(params.data.duration) },
    { field: 'rewardType' },
    { field: 'rewardMoney', filter: 'agNumberColumnFilter', valueFormatter: params => this.currencyFormatter(params.data.rewardMoney, '$'), headerName: 'Money' },
    { field: 'rewardPrestige', filter: 'agNumberColumnFilter', headerName: 'Prestige' },
  ];

  defaultColDef = {
    minWidth: 150,
    sortable: true,
    resizable: true,
    filter: true,
  } as ColDef;

  constructor(
    private compService: CompService,
  ) { }

  async loadData() {
    this._isLoading = true;
    await this.getComps();
    this.updateRows();
    this._isLoading = false;
  }

  async getComps() {
    this.rowData = await this.compService.getAllComps().toPromise();
    this.updateRows();
  }

  updateRows() {
    this.gridAPI.sizeColumnsToFit();
  }

  export() {
    this.gridAPI.exportDataAsCsv({ fileName: 'comps.csv' });
  }

  onGridReady(event: GridReadyEvent) {
    this.gridAPI = event.api;
    event.api.sizeColumnsToFit();
    this.loadData().then();
    setInterval(() => {
      event.api.refreshCells();
    }, 500)
    
  }
}
