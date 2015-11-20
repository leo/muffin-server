var express = require( 'express' ),
	loginRouter = express.Router(),
	models = require( '../models' );

var User = models( 'user' );

function generateToken() {

	var n = Math.floor( Math.random() * 11 ),
		k = Math.floor( Math.random() * 1000000 ),
		m = String.fromCharCode( n ) + k;

	return m;

}

function denyAccess( res ) {

	res.status( 403 ).json({
		error: 'invalid_grant'
	});

}

function loginRoute( app ) {

	loginRouter.post( '/token', function( req, res ) {

		var query = User.findOne({
			'_id': req.body.username
		});

		query.select( 'password' );

		query.exec( function( err, user ) {

			if( req.body.grant_type === 'password' ) {

				if( !user ) {
					denyAccess( res );
				} else if( user.password == req.body.password ) {

					res.json({
						access_token: generateToken()
					});

				} else {
					denyAccess( res );
				}

			} else {

				res.status( 400 ).json({
					error: 'unsupported_grant_type'
				});

			}

		});

	});

	app.use( '/muffin', loginRouter );

}

module.exports = loginRoute;
