import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseLessonComponent } from './choose-lesson.component';

describe('ChooseLessonComponent', () => {
  let component: ChooseLessonComponent;
  let fixture: ComponentFixture<ChooseLessonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChooseLessonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChooseLessonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
