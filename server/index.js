var compression = require( 'compression' ),
    express = require( 'express' ),
    globSync = require( 'glob' ).sync,
    morgan = require( 'morgan' );

module.exports = function( app, options ) {

  app.use( compression() );

  process.on( 'SIGINT', function() {

    db.close( function() {
      process.exit();
    });

  });

  app.get( '/muffin', function( req, res, next ) {

    if( req.path != '/muffin/' ) {
      res.redirect( '/muffin/' );
    } else {
      next();
    }

  });

  var mocks = globSync( './mocks/**/*.js', { cwd: __dirname } ).map( require );
  app.use( morgan( 'dev' ) );

  mocks.forEach( function( route ) {
    route( app );
  });

}
