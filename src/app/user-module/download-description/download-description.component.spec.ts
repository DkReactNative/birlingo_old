import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadDescriptionComponent } from './download-description.component';

describe('DownloadDescriptionComponent', () => {
  let component: DownloadDescriptionComponent;
  let fixture: ComponentFixture<DownloadDescriptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DownloadDescriptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
