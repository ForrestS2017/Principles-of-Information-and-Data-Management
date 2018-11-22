import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrinkerDetailsComponent } from './drinker-details.component';

describe('DrinkerDetailsComponent', () => {
  let component: DrinkerDetailsComponent;
  let fixture: ComponentFixture<DrinkerDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrinkerDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrinkerDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
