import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BarAnalyticsComponent } from './bar-analytics.component';

describe('BarAnalyticsComponent', () => {
  let component: BarAnalyticsComponent;
  let fixture: ComponentFixture<BarAnalyticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BarAnalyticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BarAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
