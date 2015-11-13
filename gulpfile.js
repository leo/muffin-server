var gulp = require( 'gulp' ),
	shell = require( 'gulp-shell' );

gulp.task( 'default', shell.task([
	'npm install',
	'bower install'
], {
	cwd: process.cwd() + '/client'
}));
