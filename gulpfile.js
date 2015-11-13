var gulp = require( 'gulp' ),
	shell = require( 'gulp-shell' );

gulp.task( 'setup', shell.task([
	'npm install'
]));

gulp.task( 'default', [ 'setup' ], shell.task([
	'npm install',
	'bower install'
], {
	cwd: process.cwd() + '/client'
}));
