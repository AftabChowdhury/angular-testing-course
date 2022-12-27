import { Course } from './../model/course';
import { COURSES, findLessonsForCourse } from './../../../../server/db-data';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from "@angular/core/testing";
import { CoursesService } from "./courses.service";
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';

describe('CoursesService', () => {
    let coursesService: CoursesService,
        httpTestingController: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [CoursesService]
        });
        coursesService = TestBed.get(CoursesService);
        httpTestingController = TestBed.get(HttpTestingController);

    });

    it('Get all courses', () => {
        coursesService.findAllCourses().subscribe(courses => {
            expect(courses).toBeTruthy('No courses');
            expect(courses.length).toBe(12, "Incorrect course number");

            const course = courses.find(course => course.id === 12);
            expect(course.titles.description).toBe('Angular Testing Course');
        });

        const req = httpTestingController.expectOne('/api/courses');
        expect(req.request.method).toEqual('GET');
        req.flush({ payload: Object.values(COURSES) });

    });

    it('Get single course by id', () => {
        coursesService.findCourseById(12).subscribe(course => {
            expect(course).toBeTruthy();
            expect(course.id).toBe(12);
        });

        const req = httpTestingController.expectOne('/api/courses/12');
        expect(req.request.method).toEqual('GET');
        req.flush(COURSES[12]);
    });

    it('update course', () => {
        const newCourse: Partial<Course> = { titles: { description: 'New Course' } };

        coursesService.saveCourse(12, newCourse).subscribe(course => {
            expect(course.id).toBe(12);
        });

        const req = httpTestingController.expectOne('/api/courses/12');
        expect(req.request.method).toEqual('PUT');
        expect(req.request.body.titles.description);

        req.flush({
            ...COURSES[12],
            ...newCourse
        });

    });

    it('Error if update fails', () => {
        const newCourse: Partial<Course> = { titles: { description: 'New Course' } };

        coursesService.saveCourse(12, newCourse).subscribe(
            () => fail('The update operation should failed'),

            (error: HttpErrorResponse) => {
                expect(error.status).toBe(500);
            }
        );

        const req = httpTestingController.expectOne('/api/courses/12');
        expect(req.request.method).toEqual('PUT');

        req.flush('Update course failed', { status: 500, statusText: 'Internal Server Error' });
    });

    //https://www.concretepage.com/angular/angular-test-http-post

    it('add course', () => {
        const newCourse: Partial<Course> = { id: 13, titles: { description: 'New Course 2' } };

        coursesService.addCourse(newCourse).subscribe(course => {
            expect(course.id).toBe(13);
        });

        const req = httpTestingController.expectOne('/api/courses/');
        expect(req.request.method).toEqual('POST');
        expect(req.request.body).toEqual(newCourse);

        const expectedResponse = new HttpResponse({ status: 201, statusText: 'Created', body: newCourse });
        req.event(expectedResponse);

    });

    it('add course failed', () => {
        const newCourse: Partial<Course> = { id: 13, titles: { description: 'New Course 2' } };

        coursesService.addCourse(newCourse).subscribe(
            () => fail('The add operation should failed'),

            (error: HttpErrorResponse) => {
                expect(error.status).toBe(500);
            }
        );

        const req = httpTestingController.expectOne('/api/courses/');
        expect(req.request.method).toEqual('POST');

        req.flush('Add course failed', { status: 500, statusText: 'Internal Server Error' });

    });

    it('Get list of lessons', ()=> {
        coursesService.findLessons(12).subscribe(
            lessons => {
                expect(lessons).toBeTruthy();
                expect(lessons.length).toBe(3);
            }
        );

        const req = httpTestingController.expectOne(
            req => req.url ==='/api/lessons'
        );

        expect(req.request.method).toEqual('GET');

        expect(req.request.params.get('courseId')).toEqual('12');
        expect(req.request.params.get('filter')).toEqual('');
        expect(req.request.params.get('sortOrder')).toEqual('asc');
        expect(req.request.params.get('pageNumber')).toEqual('0');
        expect(req.request.params.get('pageSize')).toEqual('3');

        req.flush({
            payload: findLessonsForCourse(12).slice(0,3)
        });

    });

    afterEach(() => {
        httpTestingController.verify();
    });
});
