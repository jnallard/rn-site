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
    const dataPoints = this.city?.rgs?.map(rg => {
      return {
        x: rg.name,
        y: rg.amountDelivered,
        goals: [
          {
            name: "Goal Before Consumption",
            value: Math.ceil((rg.maxAmount * 0.67) * (1 + rg.consumptionPercent)),
            strokeWidth: 5,
            strokeColor: "#775DD0"
          },
          {
            name: "Goal After Consumption",
            value: rg.maxAmount * 0.67,
            strokeWidth: 5,
            strokeColor: "#0000ff"
          }
        ]
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
        customLegendItems: ["Actual", "Goal Before Consumption", "Goal After Consumption"],
        markers: {
          fillColors: ["#00E396", "#775DD0", "#0000ff"]
        }
      }
    };
  }

}
