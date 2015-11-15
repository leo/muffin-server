var gulp = require( 'gulp' ),
	shell = require( 'gulp-shell' ),
	nodemon = require( 'gulp-nodemon' );
/*
gulp.task( 'core', function() {

	nodemon({
		script: 'index.js',
		ext: 'js json',
		ignore: [ 'client' ]
	});

});

gulp.task( 'watch', [ 'core' ], shell.task([
	'ember build --watch',
], {
	cwd: process.cwd() + '/client'
}));

gulp.task( 'default', shell.task([
	'npm install',
	'bower install'
], {
	cwd: process.cwd() + '/client'
}));*/
