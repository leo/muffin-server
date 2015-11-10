var EmberApp = require( 'ember-cli/lib/broccoli/ember-app' );

module.exports = function( defaults ) {

	var app = new EmberApp( defaults, {

	});

	// Use `app.import` to add additional libraries to the generated output files.
	return app.toTree();

}