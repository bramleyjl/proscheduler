'use strict';

let School = require( '../src/school.js' );
let Student = require( '../src/student.js' );
let Instructor = require( '../src/instructor.js' );
let Course = require( '../src/course.js' );

let should = require( 'should' );

describe( 'Proscheduler, functionality', function () {

    it( 'can add and retrieve students by id', function () {

        let school = new School();
        school.createStudent( 'S001', 'Thomas' );
        let thomas = school.getStudent( 'S001' );

        thomas.should.not.be.null();
        thomas.getId().should.equal( 'S001' );

        should( school.getStudent( 'dne' ) ).be.null();

    } );

    it( 'can add and retrieve instructors by id', function () {

        let school = new School();
        school.createInstructor( 'I001', 'Lynette' );
        let lynette = school.getInstructor( 'I001' );

        lynette.should.not.be.null();
        lynette.getId().should.equal( 'I001' );

        should( school.getInstructor( 'dne' ) ).be.null();

    } );

    it( 'can add and retrieve courses by id', function () {

        let school = new School();
        school.createInstructor( 'I001', 'Lynette' );
        school.createCourse( 'C001', 'UNDERWATER-BASKETWEAVING', 'I001' );
        let weaving = school.getCourse( 'C001' );

        weaving.should.not.be.null();
        weaving.getInstructor().getName().should.equal( 'Lynette' );
        should( school.getCourse( 'dne' ) ).be.null();

    } );

    it( 'can find students by case-insensitive name', function () {

        let school = new School();
        school.createStudent( 'S001', 'Thomas' );
        school.createStudent( 'S002', 'Angie' );
        school.createStudent( 'S003', 'Lars' );

        let findThom = school.findStudents( 'thom' );
        findThom.should.be.an.Array();
        findThom.length.should.equal( 1 );
        findThom[ 0 ].getId().should.equal( 'S001' );

    } );

    it( 'can find instructors by case-insensitive name', function () {

        let school = new School();
        school.createStudent( 'S001', 'Thomas' );
        school.createInstructor( 'I001', 'Lynette' );
        school.createInstructor( 'I002', 'Siobhan' );

        let teachers = school.findInstructors( 'lyn' );

        teachers.should.be.an.Array();
        teachers.length.should.equal( 1 );
        teachers[ 0 ].getId().should.equal( 'I001' );

    } );

    it( 'can find courses by case-insensitive name', function () {

        let school = new School();
        school.createStudent( 'S001', 'Thomas' );
        school.createInstructor( 'I001', 'Lynette' );
        school.createCourse( 'C001', 'UNDERWATER-BASKETWEAVING', 'I001' );
        school.createCourse( 'C002', 'CLOWNING-FOR-FUN-AND-PROFIT', 'I001' );

        let baskets = school.findCourses( 'basket' );

        baskets.should.be.an.Array();
        baskets.length.should.equal( 1 );
        baskets[ 0 ].getId().should.equal( 'C001' );

    } );

    it( 'searching for non-existent student yields empty array', function () {
        let search = ( new School ).findStudents( 'dne' );
        search.should.be.an.Array();
        search.length.should.equal( 0 );
    } );

    it( 'searching for non-existent instuctor yields empty array', function () {
        let search = ( new School ).findInstructors( 'dne' );
        search.should.be.an.Array();
        search.length.should.equal( 0 );
    } );

    it( 'searching for non-existent instuctor yields empty array', function () {
        let search = ( new School ).findInstructors( 'dne' );
        search.should.be.an.Array();
        search.length.should.equal( 0 );
    } );

    it( 'can delete students', function () {

        let school = new School();
        school.createStudent( 'S001', 'Thomas' ).deleteStudent( 'S001' );

        should( school.getStudent( 'S001' ) ).be.null();
        school.findStudents( 'Thomas' ).should.be.empty();

    } );

    it( 'can delete instructors', function () {

        let school = new School();
        school.createInstructor( 'I001', 'Lynette' ).deleteInstructor( 'I001' );

        should( school.getInstructor( 'I001' ) ).be.null();
        school.findInstructors( 'Lynette' ).should.be.empty();

    } );

    it( 'can delete courses', function () {

        let school = new School();
        school.createInstructor( 'I001', 'Lynette' );
        school.createCourse( 'C001', 'UNDERWATER-BASKETWEAVING', 'I001' );
        school.deleteCourse( 'C001' );

        should( school.getCourse( 'I001' ) ).be.null();
        school.findCourses( 'UNDERWATER-BASKETWEAVING' ).should.be.empty();

    } );

    it( 'deleting an student automatically unenrolls them from all courses', function () {

        let school = new School;
        school.createStudent( 'S001', 'Thomas' );
        school.createStudent( 'S002', 'Angie' );
        school.createStudent( 'S003', 'Siobhan' );
        school.createInstructor( 'I001', 'Lynette' );
        school.createCourse( 'C001', 'UNDERWATER-BASKETWEAVING', 'I001' );

        let studentIds = [ 'S001', 'S002', 'S003' ];

        for ( let id of studentIds ) {
            school.enroll( id, 'C001' );
        }

        school.deleteStudent( 'S001' );

        school.getCourse( 'C001' ).getStudents().length.should.equal( 2 );

    } );

    it( 'deleting an instructor automatically deletes their courses', function () {

        let school = new School;
        school.createStudent( 'S001', 'Thomas' );
        school.createStudent( 'S002', 'Angie' );
        school.createStudent( 'S003', 'Siobhan' );
        school.createInstructor( 'I001', 'Lynette' );
        school.createCourse( 'C001', 'UNDERWATER-BASKETWEAVING', 'I001' );

        let studentIds = [ 'S001', 'S002', 'S003' ];

        for ( let id of studentIds ) {
            school.enroll( id, 'C001' );
        }

        school.deleteInstructor( 'I001' );

        should( school.getInstructor( 'I001' ) ).be.null();
        should( school.getCourse( 'C001' ) ).be.null();

        for ( let id of studentIds ) {
            school.getStudent( id ).getCourses().length.should.equal( 0 );
        }

    } );

    it( 'deleting a course automatically unenrolls all of its students', function () {

        let school = new School;
        school.createStudent( 'S001', 'Thomas' );
        school.createStudent( 'S002', 'Angie' );
        school.createStudent( 'S003', 'Siobhan' );
        school.createInstructor( 'I001', 'Lynette' );
        school.createCourse( 'C001', 'UNDERWATER-BASKETWEAVING', 'I001' );

        let studentIds = [ 'S001', 'S002', 'S003' ];

        for ( let id of studentIds ) {
            school.enroll( id, 'C001' );
        }

        for ( let id of studentIds ) {
            school.getStudent( id ).getCourses().length.should.equal( 1 );
        }

        school.deleteCourse( 'C001' );

        for ( let id of [ 'S001', 'S002', 'S003' ] ) {
            school.getStudent( id ).getCourses().length.should.equal( 0 );
        }


    } );

} );

describe( 'Proscheduler, error conditions', function () {

    it( 'adding student with already-existing id is an error', function () {
        (function () {
            let school = (new School);
            school.addStudent( 'S001', 'Thomas' );
            school.addStudent( 'S001', 'Angie' );
        }).should.throw();
    } );

    it( 'adding instructor with already-existing id is an error', function () {
        (function () {
            let school = (new School);
            school.addStudent( 'S001', 'Thomas' );
            school.addInstructor( 'I001', 'Lynette' );
            school.addInstructor( 'I001', 'Lynette' );
        }).should.throw();
    } );

    it( 'adding course with already-existing id is an error', function () {
        (function () {
            let school = (new School);
            school.addStudent( 'S001', 'Thomas' );
            school.addInstructor( 'I001', 'Lynette' );
            school.createCourse( 'C001', 'UNDERWATER-BASKETWEAVING', 'I001' );
            school.createCourse( 'C001', 'CLOWNING-FOR-FUN-AND-PROFIT', 'I001' );
        }).should.throw();
    } );

    it( 'adding course with non-existent instructor is an error', function () {
        (function () {
            let school = (new School);
            school.addStudent( 'S001', 'Thomas' );
            school.createCourse( 'C001', 'UNDERWATER-BASKETWEAVING', 'I001' );
        }).should.throw();
    } );

    it( 'deleting a non-existent student is an error', function () {
        (function () {
            let school = new School();
            school.deleteStudent( 'S999' );
        }).should.throw();
    } );

    it( 'deleting a non-existent instructor is an error', function () {
        (function () {
            let school = new School();
            school.deleteInstructor( 'I999' );
        }).should.throw();
    } );

    it( 'deleting a non-existent course is an error', function () {
        (function () {
            let school = new School();
            school.deleteCourse( 'C999' );
        }).should.throw();
    } );

    it( 'enrolling non-existent student is an error', function () {
        (function () {
            let school = new School();
            school.createStudent( 'S001', 'Thomas' );
            school.createInstructor( 'I001', 'Lynette' );
            school.createCourse( 'C001', 'UNDERWATER-BASKETWEAVING', 'I001' );
            school.enroll( 'S999', 'C001' );
        }).should.throw();
    } );

    it( 'enrolling into non-existent course is an error', function () {
        (function () {
            let school = new School();
            school.createStudent( 'S001', 'Thomas' );
            school.createInstructor( 'I001', 'Lynette' );
            school.createCourse( 'C001', 'UNDERWATER-BASKETWEAVING', 'I001' );
            school.enroll( 'S001', 'C999' );
        }).should.throw();
    } );

} );

describe( 'Proscheduler, return values', function () {

    /* STUDENTS */

    it( 'createStudent() should return `this`', function () {
        let school = new School;
        school.createStudent( 'S001', 'Thomas' ).should.equal( school );
    } );

    it( 'getStudent() should return a Student (or null)', function () {
        let school = new School;
        school.createStudent( 'S001', 'Thomas' );
        school.getStudent( 'S001' ).should.be.a.Student;
        should( school.getStudent( 'S999' ) ).be.null();
    } );

    it( 'getAllStudents() should return an Array', function () {
        let school = new School;
        school.createStudent( 'S001', 'Thomas' );
        school.getAllStudents( 'S001' ).should.be.an.Array;
    } );

    it( 'findStudents() should return an Array', function () {
        let school = new School;
        school.createStudent( 'S001', 'Thomas' );
        school.findStudents( 'dne' ).should.be.an.Array;
    } );

    it( 'deleteStudent() should return `this`', function () {
        let school = new School;
        school.createStudent( 'S001', 'Thomas' );
        school.deleteStudent( 'S001' ).should.equal( school );
    } );

    /* INSTRUCTORS */

    it( 'createInstructor() should return `this`', function () {
        let school = new School;
        school.createInstructor( 'I001', 'Lynette' ).should.equal( school );
    } );

    it( 'getInstructor() should return a Instructor (or null)', function () {
        let school = new School;
        school.createInstructor( 'I001', 'Lynette' );
        school.getInstructor( 'I001' ).should.be.an.Instructor;
        should( school.getInstructor( 'I999' ) ).be.null();
    } );

    it( 'getAllInstructors() should return an Array', function () {
        let school = new School;
        school.createInstructor( 'I001', 'Lynette' );
        school.getAllInstructors( 'I001' ).should.be.an.Array;
    } );

    it( 'findInstructors() should return an Array', function () {
        let school = new School;
        school.createInstructor( 'I001', 'Lynette' );
        school.findInstructors( 'dne' ).should.be.an.Array;
    } );

    it( 'deleteInstructor() should return `this`', function () {
        let school = new School;
        school.createInstructor( 'I001', 'Lynette' );
        school.deleteInstructor( 'I001' ).should.equal( school );
    } );

    /* COURSES */

    it( 'createCourse() should return `this`', function () {
        let school = new School;
        school.createInstructor( 'I001', 'Lynette' );
        school.createCourse( 'C001', 'BREAKDANCE!', 'I001' ).should.equal( school );
    } );

    it( 'getCourse() should return a Course (or null)', function () {
        let school = new School;
        school.createInstructor( 'I001', 'Lynette' );
        school.createCourse( 'C001', 'BREAKDANCE!', 'I001' );
        school.getCourse( 'C001' ).should.be.a.Course;
        should( school.getCourse( 'C999' ) ).be.null();
    } );

    it( 'getAllCourses() should return an Array', function () {
        let school = new School;
        school.createInstructor( 'I001', 'Lynette' );
        school.createCourse( 'C001', 'BREAKDANCE!', 'I001' );
        school.getAllCourses( 'C001' ).should.be.an.Array;
    } );

    it( 'findCourses() should return an Array', function () {
        let school = new School;
        school.createInstructor( 'I001', 'Lynette' );
        school.createCourse( 'C001', 'BREAKDANCE!', 'I001' );
        school.findCourses( 'dne' ).should.be.an.Array;
    } );

    it( 'deleteCourse() should return `this`', function () {
        let school = new School;
        school.createInstructor( 'I001', 'Lynette' );
        school.createCourse( 'C001', 'BREAKDANCE!', 'I001' );
        school.deleteCourse( 'C001' ).should.equal( school );
    } );

    /* ENROLLMENT */

    it( 'enroll() should return `this`', function () {
        let school = new School;
        school.createStudent( 'S001', 'Thomas' );
        school.createInstructor( 'I001', 'Lynette' );
        school.createCourse( 'C001', 'BREAKDANCE!', 'I001' );
        school.enroll( 'S001', 'C001' ).should.equal( school );
    } );

    it( 'unenroll() should return `this`', function () {
        let school = new School;
        school.createStudent( 'S001', 'Thomas' );
        school.createInstructor( 'I001', 'Lynette' );
        school.createCourse( 'C001', 'BREAKDANCE!', 'I001' );
        school.enroll( 'S001', 'C001' );
        school.unenroll( 'S001', 'C001' ).should.equal( school );
    } );

} );
