
'use strict';

module.exports = function Student ( school, id, name ) {

    this.getId = function () {
        return id;
    };

    this.getName = function () {
        return name;
    };

    /*
        Retrieve a list of Courses this Student is enrolled in.
    */

    this.getCourses = function () {
        return school.getAllCourses().filter( ( course ) => {
            return this.isEnrolledIn( course );
        } );
    };

    /*
        Retrieve a list of Instructors for the Courses this Student is
        currently enrolled in. (Produces duplicates.)
    */

    this.getInstructors = function () {
        return school.getAllCourses().filter( ( course ) => {
            return this.isEnrolled( course );
        } ).map( ( course ) => {
            return course.getInstructor();
        } );
    };

    /*
        Is this Student enrolled in that Course?
    */

    this.isEnrolledIn = function ( course ) {
        return school.isEnrolled( id, course.getId() );
    };

};