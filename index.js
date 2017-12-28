'use strict';

/*
    This module is the REPL interface to ProScheduler.
    You do not need to make changes to or use it to complete this assignment.
*/

let School = require( './src/school.js' );

/*
    This `School` instance will be used for the entire life of this program.
*/

let school = new School;

/*
    These regular expressions are used to parse user input, so as to be more
    flexible in patterns we expect (e.g. "create" instead of "add").
*/

let patterns = {
    'quit'       : /^quit|q$/i,
    'add'        : /^add|create$/i,
    'get'        : /^get$/i,
    'find'       : /^find$/i,
    'list'       : /^list$/i,
    'delete'     : /^delete$/i,
    'enroll'     : /^enroll$/i,
    'unenroll'   : /^unenroll$/i,
    'student'    : /^student$/i,
    'instructor' : /^instructor$/i,
    'course'     : /^course$/i,
    'comment'    : /^\#/
};

/*
    `readline` is a common Linux library to create REPL-style interfaces.
    Since Node has it built in, we include it here.
*/

let readline = require( 'readline' ).createInterface( {
    input : process.stdin,
    output: process.stdout,
    prompt : 'proscheduler > ',

    // The 'completer' function determines what happens when TAB is pressed.
    completer : function ( partial, callback ) {
        let segment = partial.trim().split( /[\s]+/ ).filter( s => s ).pop();
        let candidates = Object.keys( patterns );
        let startingNewSegment = partial[ partial.length - 1 ] === ' ';
        if ( !startingNewSegment && segment && segment.length ) {
            candidates = candidates.filter( ( candidate ) => {
                return candidate.toLowerCase().startsWith( segment );
            } );
        }
        callback( null, [ candidates, segment ] );
    }
} );

readline.setPrompt( 'proscheduler > ' );

readline.on( 'line', function ( line ) {

    /*
        Break the line by spaces and remove empty-string entries so that, e.g.
        "hello world !@" becomes [ "hello", "world", "!@" ].
    */
    line = line.trim().split( /[\s]+/ ).filter( s => s );

    if ( !line.length || patterns.comment.test( line ) ) {
        readline.prompt();
        return;
    }

    try {

        /*
            Try each of the patterns defined above and, for each one, perform
            the corresponding action in School.
        */

        if ( patterns.quit.test( line[ 0 ] ) ) {
            process.exit( 0 );
        } else if ( patterns.add.test( line[ 0 ] ) ) {
            if ( line.length === 4 ) {
                if ( patterns.student.test( line[ 1 ] ) ) {
                    school.createStudent( line[ 2 ], line[ 3 ] );
                } else if ( patterns.instructor.test( line[ 1 ] ) ) {
                    school.createInstructor( line[ 2 ], line[ 3 ] );
                } else {
                    throw new Error( `unknown object: ${line[ 1 ]}` );
                }
            } else if ( line.length === 5 ) {
                if ( patterns.course.test( line[ 1 ] ) ) {
                    school.createCourse( line[ 2 ], line[ 3 ], line[ 4 ] );
                } else {
                    throw new Error( "Unknown object ${line[ 1 ]}, or wrong arg count." );
                }
            }
        } else if ( patterns.get.test( line[ 0 ] ) ) {
            if ( line.length < 2 ) {
                throw new Error( "not enough arguments" );
            } else if ( patterns.student.test( line[ 1 ] ) ) {
                school.getStudent( line[ 2 ] );
            } else if ( patterns.instructor.test( line[ 1 ] ) ) {
                school.getInstructor( line[ 2 ] );
            } else if ( patterns.class.test( line[ 1 ] ) ) {
                school.getCourse( line[ 2 ] );
            } else {
                throw new Error( `unknown object: ${line[ 1 ]}` );
            }
        } else if ( patterns.find.test( line[ 0 ] ) ) {
            if ( line.length < 2 ) {
                throw new Error( "not enough arguments" );
            } else if ( patterns.student.test( line[ 1 ] ) ) {
                school.findStudents( line[ 2 ] );
            } else if ( patterns.instructor.test( line[ 1 ] ) ) {
                school.findInstructors( line[ 2 ] );
            } else if ( patterns.class.test( line[ 1 ] ) ) {
                school.findCourses( line[ 2 ] );
            } else {
                throw new Error( `unknown object: ${line[ 1 ]}` );
            }
        } else if ( patterns.delete.test( line[ 0 ] ) ) {
            if ( line.length < 2 ) {
                throw new Error( "not enough arguments" );
            } else if ( patterns.student.test( line[ 1 ] ) ) {
                school.deleteStudent( line[ 2 ] );
            } else if ( patterns.instructor.test( line[ 1 ] ) ) {
                school.deleteInstructor( line[ 2 ] );
            } else if ( patterns.class.test( line[ 1 ] ) ) {
                school.deleteCourse( line[ 2 ] );
            } else {
                throw new Error( `unknown object: ${line[ 1 ]}` );
            }
        } else if ( patterns.list.test( line[ 0 ] ) ) {
            if ( line.length < 1 ) {
                throw new Error( "not enough arguments" );
            } else if ( patterns.student.test( line[ 1 ] ) ) {
                for ( let student of school.getAllStudents() ) {
                    let name = student.getName();
                    let id = student.getId();
                    let courses = student.getCourses().map(
                        c => c.getName()
                    ).join( ', ' );
                    console.log( `\t${name} (id ${id}) is taking ${courses}` );
                }
            } else if ( patterns.instructor.test( line[ 1 ] ) ) {
                for ( let instructor of school.getAllInstructors() ) {
                    let name = instructor.getName();
                    let id = instructor.getId();
                    let courses = instructor.getCourses().map(
                        c => c.getName()
                    ).join( ', ' );
                    console.log( `\t${name} (id ${id}) is teaching ${courses}` );
                }
            } else if ( patterns.course.test( line[ 1 ] ) ) {
                for ( let course of school.getAllCourses() ) {
                    let name = course.getName();
                    let id = course.getId();
                    let instructorName = course.getInstructor().getName();
                    let studentCount = course.getStudents().length;
                    console.log(
                        `\t${name} (id ${id}) is being taught by ${instructorName}`
                            + ` and has ${studentCount} students`
                    );
                }
            } else {
                throw new Error( `unknown object: ${line[ 1 ]}` );
            }
        } else if ( patterns.enroll.test( line[ 0 ] ) ) {
            school.enroll( line[ 1 ], line[ 2 ] );
        } else if ( patterns.unenroll.test( line[ 0 ] ) ) {
            school.unenroll( line[ 1 ], line[ 2 ] );
        } else {
            throw new Error( `unknown command: ${line[ 0 ]}` );
        }

    } catch ( error ) {

        /*
            Whenever an Error is thrown, abort the action, spit the message
            out to the user and re-prompt.
        */

        console.log( `\t${error}` );

    }

    /*
        Forever prompt until CTRL+C is pressed or 'quit' is entered.
    */

    readline.prompt();

} );

/*
    Prompt the user for the first time.
*/

readline.prompt();
