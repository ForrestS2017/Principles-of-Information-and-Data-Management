import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BartendersComponent } from './bartenders.component';

describe('BartendersComponent', () => {
  let component: BartendersComponent;
  let fixture: ComponentFixture<BartendersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BartendersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BartendersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
