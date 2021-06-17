import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RgChartComponent } from './rg-chart.component';

describe('RgChartComponent', () => {
  let component: RgChartComponent;
  let fixture: ComponentFixture<RgChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RgChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RgChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
