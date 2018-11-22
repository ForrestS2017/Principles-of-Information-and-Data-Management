import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BartenderAnalyticsComponent } from './bartender-analytics.component';

describe('BartenderAnalyticsComponent', () => {
  let component: BartenderAnalyticsComponent;
  let fixture: ComponentFixture<BartenderAnalyticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BartenderAnalyticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BartenderAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
