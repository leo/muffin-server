import Ember from 'ember';
/*
export default Ember.Controller.extend({

	actions: {

		login: function() {

			var me = $( 'form' ),
				timeout;

			if( me.hasClass( 'shake' ) ) {
				return false;
			}

			$.post( '/admin', {
				username: this.get( 'username' ),
				password: this.get( 'password' )
			}, function( response ) {

				if( parseInt( response ) ) {
					location.reload();
				} else {

					clearTimeout( timeout );
					this.set( 'loginStatus', 'shake' );

					$( 'input' ).addClass( 'wrong' );

					timeout = setTimeout( function() {
						this.set( 'loginStatus', '' );
					}.bind( this ), 1000);

				}

			}.bind( this ));

		}

	}

});*/

export default Ember.Controller.extend({
	session: Ember.inject.service( 'session' ),

	actions: {
		authenticate() {

			let { username, password } = this.getProperties( 'username', 'password' );

			this.get( 'session' ).authenticate( 'authenticator:oauth2', username, password ).catch( (reason) => {

				var timeout;

				clearTimeout( timeout );
				this.set( 'loginStatus', 'shake' );

				$( 'input' ).addClass( 'wrong' );

				timeout = setTimeout( function() {
					this.set( 'loginStatus', '' );
				}.bind( this ), 1000);

				this.set( 'errorMessage', reason.error );

			});

		},
		/*
		checkError( top, which ) {
			var type = which === 'password' ? 'password' : 'text';
			$( 'input[type="' + type + '"]' ).removeClass( 'wrong' );
		}.observes( 'username', 'password' )*/

	}

});
