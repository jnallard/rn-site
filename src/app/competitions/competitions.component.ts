import { Component, OnDestroy } from '@angular/core';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { Comp } from '../shared/models/comp.model';
import { CompService } from '../shared/services/comp.service';

@Component({
  selector: 'app-competitions',
  templateUrl: './competitions.component.html',
  styleUrls: ['./competitions.component.css'],
})
export class CompetitionsComponent implements OnDestroy {

  _isLoading = true;
  get isLoading() {
    return this._isLoading;
  }

  rowData: Comp[] = [];
  intervals: NodeJS.Timeout[] = [];

  currencyFormatter = (currency, sign) => {
    var sansDec = currency.toFixed(0);
    var formatted = sansDec.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return sign + `${formatted}`;
  };

  getSecondsRemaining = (time: Date) => {
    return (time.getTime() - new Date().getTime()) / 1000;
  }

  getTimeRemaining = (time: Date) => {
    const timeSeconds = this.getSecondsRemaining(time);
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
    if(timeSeconds < 0) {
      return '';
    }
    const minutes = Math.floor(timeSeconds / 60);
    const seconds = Math.floor(timeSeconds % 60);
    if(seconds) {
      return `${minutes}m ${seconds}s`;
    }
    return `${minutes}m`;
  };

  amountFormatter = (comp: Comp) => {
    let amount = `${comp.playerAmount} / ${comp.amount}`;
    if(comp.playerPosition) {
      amount += ` (#${comp.playerPosition})`;
    }
    return amount;
  }

  getRowStyle = (params) => {
    if (params.data.playerCompleted) {
      return { 'background-color': '#2cff002f' };
    }
    if (params.data.playerAccepted) {
      return { 'background-color': '#ffff002f' };
    }
  }

  getRowId = (params) => params.data.id;

  private gridAPI: GridApi;
  columnDefs: ColDef[] = [
    { field: 'city' } as ColDef,
    { field: 'resource' },
    { field: 'amount', valueFormatter: params => this.amountFormatter(params.data) },
    { field: 'rewardType',
      cellRenderer: params => {
        let faIcon = '';
        let faColor = '';
        let boldText = '';
        switch(params.value) {
          case 'Prestige':
            faIcon = 'fa-crown';
            faColor = 'purple';
            boldText = `(${params.data.rewardPrestige})`;
            break;
          case 'Lottery':
            faIcon = 'fa-ticket-alt';
            faColor = 'green';
            break;
          case 'Gold/Plus':
            faIcon = 'fa-coins';
            faColor = 'goldenrod';
            break;
          case 'License':
            faIcon = 'fa-file-signature';
            faColor = 'darkgray';
            break;
          case 'Cargo Train':
            faIcon = 'fa-train';
            faColor = 'red';
            break;
          case 'Research':
            faIcon = 'fa-microscope';
            faColor = 'blue';
            break;
        }
        return `<i class="fas ${faIcon}" style="color: ${faColor}"></i> ${params.value} <strong>${boldText}</strong>`;
      },
      filterParams: {}
    },
    { field: 'rewardMoney', filter: 'agNumberColumnFilter', valueFormatter: params => this.currencyFormatter(params.data.rewardMoney, '$'), headerName: 'Money' },
    { field: 'startTime', filter: 'agNumberColumnFilter', valueFormatter: params => this.timeFormatter(params.value) },
    { field: 'startsIn', filter: 'agNumberColumnFilter', valueFormatter: params => this.getTimeRemaining(params.value) },
    { field: 'durationLeft', filter: 'agNumberColumnFilter', valueFormatter: params => this.durationFormatter(params.value), headerName: 'Duration Left',
      cellRenderer: params => {
        let duration = params.value;
        if (!duration) {
          return '';
        }
        const secondsFromStartTime = this.getSecondsRemaining(params.data.startTime);
        let color = '#CCCCCC59';
        if(secondsFromStartTime < 0) {
          color = '#00aa0059';
        }
        const percent = Math.floor(100 * duration / 3600);
        return `<p style="background: linear-gradient(90deg, ${color} ${percent}%, #00000000 0%);">${this.durationFormatter(duration)}</p>`;
      }
    },
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

  ngOnDestroy(): void {
    this.intervals.forEach(interval => clearInterval(interval));
  }

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
    setTimeout(() => this.gridAPI.sizeColumnsToFit(), 100);
  }

  export() {
    this.gridAPI.exportDataAsCsv({ fileName: 'comps.csv' });
  }

  onGridReady(event: GridReadyEvent) {
    this.gridAPI = event.api;
    event.api.sizeColumnsToFit();
    this.loadData().then();
    this.intervals.push(setInterval(() => {
      this.getAllRows().forEach(comp => {
        let duration = comp.duration;
        if (!duration) {
          return '';
        }
        const secondsFromStartTime = this.getSecondsRemaining(comp.startTime);
        if(secondsFromStartTime < 0) {
          duration += secondsFromStartTime;
        }
        comp.durationLeft = duration;
        event.api.applyTransaction({update: [comp]});
      })
      event.api.refreshCells();
    }, 500));
    this.intervals.push(setInterval((async () => {
      this.getAllRows().filter(comp => comp.durationLeft > 0 && comp.durationLeft < comp.duration && !comp.playerCompleted).forEach(async comp => {
        let updatedComp = await this.compService.getComp(comp.id).toPromise();
        updatedComp.durationLeft = comp.durationLeft;
        event.api.applyTransaction({update: [updatedComp]});
      });
    }), 5000));
  }

  getAllRows() {
    let rowData = [] as Comp[];
    this.gridAPI.forEachNode(node => rowData.push(node.data));
    return rowData;
  }
}
