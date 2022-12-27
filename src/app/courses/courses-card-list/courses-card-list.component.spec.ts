import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CoursesCardListComponent } from './courses-card-list.component';
import { CoursesModule } from '../courses.module';
import { COURSES } from '../../../../server/db-data';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { sortCoursesBySeqNo } from '../home/sort-course-by-seq';
import { Course } from '../model/course';
import { setupCourses } from '../common/setup-test-data';




describe('CoursesCardListComponent', () => {

  let component: CoursesCardListComponent;
  let fixture: ComponentFixture<CoursesCardListComponent>;
  let debugElement: DebugElement;

  beforeEach(async() => {
    TestBed.configureTestingModule({
      imports: [CoursesModule]
    }).compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(CoursesCardListComponent);
        component = fixture.componentInstance;
        debugElement = fixture.debugElement;
      });
  });


  it("should create the component", () => {
    expect(component).toBeTruthy();
  });


  it("should display the course list", () => {
    component.courses = setupCourses();
    /**
     * Manually trigger angular change detection and apply these changes to the DOM**/
    fixture.detectChanges();

    const cards = debugElement.queryAll(By.css('.course-card'));

    expect(cards).toBeTruthy('No cards found');
    expect(cards.length).toBe(12, 'Wrong number of courses');
  });


  it("should display the first course", () => {
    component.courses = setupCourses();

    /**
     * Manually trigger angular change detection and apply these changes to the DOM**/
    fixture.detectChanges();

    const course = component.courses[0];

    const card = debugElement.query(By.css(".course-card")),
            title = card.query(By.css("mat-card-title")),
            image = card.query(By.css("img"));

    expect(card).toBeTruthy("Could not find course card");

    expect(title.nativeElement.textContent).toBe(course.titles.description);

    expect(image.nativeElement.src).toBe(course.iconUrl);
  });


});


