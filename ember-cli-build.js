/*jshint node:true*/
/* global require, module */

var EmberApp = require( 'ember-cli/lib/broccoli/ember-app' );

module.exports = function( defaults ) {

	var app = new EmberApp( defaults, {

		outputPaths: {

			app: {
				js: '/assets/app.js',
				css: {
					'app': '/assets/styles.css'
				}
			}

		},

		minifyJS: {
			enabled: false
		}

	});

	// Use `app.import` to add additional libraries to the generated output files.
	return app.toTree();

}
