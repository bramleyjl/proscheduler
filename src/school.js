'use strict';

let Student = require('./student.js');
let Instructor = require('./instructor.js');
let Course = require('./course.js');
let _ = require('lodash');

let students = {};
let instructors = {};
let courses = {};
let enrollment = {};

module.exports = function() {
  let students = {};

  /* STUDENTS */

  this.createStudent = function(id, name) {
    if (students[id] !== undefined)
      throw new Error('Student with ID ' + id + ' already exists.');
    let newStudent = new Student(this, id, name);
    students[id] = newStudent;
    return this;
  };

  this.getStudent = function(id) {
    if (students[id] !== undefined) return students[id];
    else return null;
  };

  this.getAllStudents = function() {
    let studentList = [];
    _.forIn(students, function(value, key) {
      studentList.push(value);
    });
    return studentList;
  };

  this.findStudents = function(query) {
    let searchResults = [];
    _.forIn(students, function(value, key) {
      if (value.getName().toLowerCase().indexOf(query.toLowerCase()) !== -1)
        searchResults.push(value);
    });
    return searchResults;
  };

  this.deleteStudent = function(id) {
    if (students[id] !== undefined) {
      _.forIn(enrollment, function(value, key) {
        enrollment[key].splice(value, 1);
      });
      delete students[id];
      return this;
    } else {
      throw new Error('No student with ID ' + id + ' was found.');
    }
  };

  /* INSTRUCTORS */

  this.createInstructor = function(id, name) {
    if (instructors[id] !== undefined)
      throw new Error('Instructor with ID ' + id + ' already exists.');
    let newInstructor = new Instructor(this, id, name);
    instructors[id] = newInstructor;
    return this;
  };

  this.getInstructor = function(id) {
    if (instructors[id] !== undefined) return instructors[id];
    else return null;
  };

  this.getAllInstructors = function() {
    let instructorList = [];
    _.forIn(instructors, function(value, key) {
      instructorList.push(value);
    });
    return instructorList;
  };

  this.findInstructors = function(query) {
    let searchResults = [];
    _.forIn(instructors, function(value, key) {
      if (value.getName().toLowerCase().indexOf(query.toLowerCase()) !== -1)
        searchResults.push(value);
    });
    return searchResults;
  };

  this.deleteInstructor = function(id) {
    if (instructors[id] !== undefined) {
      let courseDeleteList = instructors[id].getCourses();
      for (var i = 0; i < courseDeleteList.length; i++) {
        this.deleteCourse(courseDeleteList[i].getId());
      }
      delete instructors[id];
      return this;
    } else {
      throw new Error('No instructor with ID ' + id + ' was found.');
    }
  };

  /* COURSES */

  this.createCourse = function(id, name, instructorId) {
    if (courses[id] !== undefined)
      throw new Error('Course with ID ' + id + ' already exists.');
    if (instructors[instructorId] === undefined)
      throw new Error('No instructor with ID ' + instructorId + ' was found.');
    let newCourse = new Course(this, id, name, instructorId);
    courses[id] = newCourse;
    enrollment[id] = [];
    return this;
  };

  this.getCourse = function(id) {
    if (courses[id] !== undefined) return courses[id];
    else return null;
  };

  this.getAllCourses = function() {
    let courseList = [];
    _.forIn(courses, function(value, key) {
      courseList.push(value);
    });
    return courseList;
  };

  this.findCourses = function(query) {
    let searchResults = [];
    _.forIn(courses, function(value, key) {
      if (value.getName().toLowerCase().indexOf(query.toLowerCase()) !== -1)
        searchResults.push(value);
    });
    return searchResults;
  };

  this.deleteCourse = function(id) {
    if (courses[id] !== undefined) {
      delete enrollment[id];
      delete courses[id];
      return this;
    } else {
      throw new Error('No course ID ' + id + ' was found.');
    }
  };

  /* ENROLLMENT */

  this.enroll = function(studentId, courseId) {
    if (students[studentId] === undefined) {
      throw new Error('No student with ID ' + studentId + ' was found.');
    } else if (courses[courseId] === undefined) {
      throw new Error('No course with ID ' + courseId + ' was found.');
    } else if (enrollment[courseId] !== undefined && enrollment[courseId].indexOf(studentId) > -1) {
      throw new Error('Student with ID ' + studentId +' is already enrolled in course ' + courseId + '.');
    } else {
      enrollment[courseId].push(studentId);
      return this;
    }
  };

  this.unenroll = function(studentId, courseId) {
    if (Object.values(enrollment).indexOf(studentId) === -1)
      throw new Error('No student with ID ' + studentId +' is enrolled in course ' + courseId + '.');
    enrollment[courseId].splice(studentId, 1);
    return this;
  };

  this.isEnrolled = function(studentId, courseId) {
    if (enrollment[courseId].indexOf(studentId) > -1) return studentId;
  };
};