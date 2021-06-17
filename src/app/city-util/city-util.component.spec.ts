import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CityUtilComponent } from './city-util.component';

describe('CityUtilComponent', () => {
  let component: CityUtilComponent;
  let fixture: ComponentFixture<CityUtilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CityUtilComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CityUtilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
