import { Component, Input, OnInit, ViewChild } from "@angular/core";
import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexLegend
} from "ng-apexcharts";
import { SettingsService } from "src/app/shared/services/settings.service";
import { CityUtilComponent } from "../city-util.component";
import { City } from "../city.model";
import { RequiredGood } from "../required-good.model";

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
  public paxChartOptions: ChartOptions = new ChartOptions();

  constructor(private settings: SettingsService) { }

  ngOnInit(): void {
    let firstRg = this.city?.rgs?.[0];
    if(firstRg && this.city.level >= 5) {
      firstRg.name = `${firstRg.name} [D]`;
    }
    const dataPoints = this.city?.rgs?.map(rg => {
      let goalAfterConsumption = rg.maxAmount * 0.67;
      let goalBeforeConsumption = Math.ceil(goalAfterConsumption / (1 - rg.consumptionPercent));
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
            strokeWidth: 3,
            strokeColor: "#775DD0"
          },
          {
            name: "Demand After Consumption",
            value: goalAfterConsumption,
            strokeWidth: 3,
            strokeColor: "#0000ff"
          },
          {
            name: "Last Amount",
            value: rg.lastAmount,
            strokeWidth: 2,
            strokeColor: "#cccccc"
          }
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
        height: 200,
        type: "bar",
        toolbar: {
          show: false
        },
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
            const deficit = +val - goals[0].value;
            const deficitDisplay = deficit > 0 ? `+${deficit}` : deficit;
            return `${val} / ${goals[0].value} (${deficitDisplay})`;
          }
          return val as number;
        }
      },
      legend: {
        show: false,
        showForSingleSeries: true,
        customLegendItems: ["Demand Before Consumption", "Demand After Consumption", "Deficit"],
        markers: {
          fillColors: ["#775DD0", "#0000ff", ]
        }
      }
    };
    if(this.city.paxRg) {
      const paxDataPoints = [this.city?.paxRg].map(rg => {
        let demand = rg.maxAmount;
        let fillColor = "#00E396";
        if(rg.amountDelivered < demand) {
          fillColor = '#d93300'
        }
        return {
          x: rg.name,
          y: rg.amountDelivered,
          goals: [
            {
              name: "Demand",
              value: demand,
              strokeWidth: 5,
              strokeColor: "#775DD0"
            }
          ],
          fillColor
        }
      }) ?? [];
      this.paxChartOptions = {
        series: [
          {
            name: "Actual",
            data: paxDataPoints,
          }
        ],
        chart: {
          height: 105,
          type: "bar",
          toolbar: {
            show: false
          },
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
          show: false,
          showForSingleSeries: true,
          customLegendItems: ["Demand"],
          markers: {
            fillColors: ["#775DD0"]
          }
        }
      };
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

  getPPRatio(rg: RequiredGood) {
    return rg.getBestTonnagePrestigeRatio(CityUtilComponent.CurrentId);
  }


  getPPRatioOpacity(rg: RequiredGood) {
    return Math.max(rg.getBestTonnagePrestigeRatio(CityUtilComponent.CurrentId) / CityUtilComponent.BestPPRatio, 0.15);
  }

}
