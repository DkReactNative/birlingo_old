import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SusbscriptionComponent } from './susbscription.component';

describe('SusbscriptionComponent', () => {
  let component: SusbscriptionComponent;
  let fixture: ComponentFixture<SusbscriptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SusbscriptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SusbscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
