module.exports = function( app ) {

	var express = require( 'express' ),
		loginRouter = express.Router(),
		models = require( '../models' );

	var User = models( 'user' );

	loginRouter.post( '/token', function( req, res ) {

		function denyAccess() {

			res.status( 400 ).json({
				error: 'invalid_grant'
			});

		}

		var query = User.findOne({
			'_id': req.body.username
		});

		query.select( 'password' );

		query.exec( function( err, user ) {

			if( req.body.grant_type === 'password' ) {

				if( !user ) {
					denyAccess();
				} else if( user.password == req.body.password ) {

					res.status( 200 ).json({
						access_token: 'secret token!'
					});

				} else {
					denyAccess();
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
