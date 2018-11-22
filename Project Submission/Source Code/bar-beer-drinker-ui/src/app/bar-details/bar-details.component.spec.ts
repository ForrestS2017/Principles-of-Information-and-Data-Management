import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BarDetailsComponent } from './bar-details.component';

describe('BarDetailsComponent', () => {
  let component: BarDetailsComponent;
  let fixture: ComponentFixture<BarDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BarDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BarDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
