import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseLanguageComponent } from './choose-language.component';

describe('ChooseLanguageComponent', () => {
  let component: ChooseLanguageComponent;
  let fixture: ComponentFixture<ChooseLanguageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChooseLanguageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChooseLanguageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
