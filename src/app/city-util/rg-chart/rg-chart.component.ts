import { Component, Input, OnInit, ViewChild } from "@angular/core";
import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexLegend
} from "ng-apexcharts";
import { City } from "../city.model";

class ChartOptions {
  series: ApexAxisChartSeries = [];
  chart!: ApexChart;
  dataLabels!: ApexDataLabels;
  plotOptions!: ApexPlotOptions;
  legend!: ApexLegend;
  colors: string[] = [];
};

@Component({
  selector: 'app-rg-chart',
  templateUrl: './rg-chart.component.html',
  styleUrls: ['./rg-chart.component.css']
})
export class RgChartComponent implements OnInit {
  @ViewChild("chart") chart: ChartComponent | null = null;
  @Input()
  public city: City | null = null;
  public chartOptions: ChartOptions = new ChartOptions();

  constructor() { }

  ngOnInit(): void {
    console.log(this.city);
    let firstRg = this.city?.rgs?.[0];
    if(firstRg) {
      firstRg.name = `${firstRg.name}*`;
    }
    const dataPoints = this.city?.rgs?.map(rg => {
      let goalAfterConsumption = rg.maxAmount * 0.67;
      let goalBeforeConsumption = Math.ceil(goalAfterConsumption * (1 + rg.consumptionPercent));
      let fillColor = "#00E396";
      if(rg.amountDelivered < goalAfterConsumption) {
        fillColor = '#d93300'
      }
      else if(rg.amountDelivered < goalBeforeConsumption) {
        fillColor = '#d9a600'
      }
      return {
        x: rg.name,
        y: rg.amountDelivered,
        goals: [
          {
            name: "Demand Before Consumption",
            value: goalBeforeConsumption,
            strokeWidth: 5,
            strokeColor: "#775DD0"
          },
          {
            name: "Demand After Consumption",
            value: goalAfterConsumption,
            strokeWidth: 5,
            strokeColor: "#0000ff"
          },
          
        ],
        fillColor
      }
    }) ?? [];
    this.chartOptions = {
      series: [
        {
          name: "Actual",
          data: dataPoints,
        }
      ],
      chart: {
        height: 350,
        type: "bar"
      },
      plotOptions: {
        bar: {
          horizontal: true,
        },
      },
      colors: ["#00E396"],
      dataLabels: {
        formatter: function (val, opts) {
          const goals =
            opts.w.config.series[opts.seriesIndex].data[opts.dataPointIndex]
              .goals;

          if (goals && goals.length) {
            return `${val} / ${goals[0].value}`;
          }
          return val as number;
        }
      },
      legend: {
        show: true,
        showForSingleSeries: true,
        customLegendItems: ["Demand Before Consumption", "Demand After Consumption"],
        markers: {
          fillColors: ["#775DD0", "#0000ff"]
        }
      }
    };
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

}
