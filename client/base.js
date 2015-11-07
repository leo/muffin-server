window.App = Ember.Application.create({
	rootElement: 'body',
	LOG_TRANSITIONS: true
});

App.Router.reopen({
	rootURL: '/admin'
});

App.Router.map( function() {
	this.route( 'login', { path: '/' } );
});

App.LoginRoute = Ember.Route.extend({

	renderTemplate: function() {
		$( 'body' ).addClass( 'login' );
		this.render( 'login' );
	}

});

var tryLogin = function() {

	var me = $( 'form' ),
		timeout,
		status = this.get( 'loginStatus' );

	if( me.hasClass( 'shake' ) ) {
		return false;
	}

	$.post( '/admin', {
		username: this.get( 'username' ),
		password: this.get( 'password' )
	}, function( response ) {

		if( parseInt( response ) ) {
			this.get( 'target.router' ).refresh();
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

App.LoginController = Ember.Controller.extend({

	actions: {
		login: tryLogin
	},

	checkError: function( top, which ) {

		var type = which == 'password' ? 'password' : 'text';
		$( 'input[type="' + type + '"]' ).removeClass( 'wrong' );

	}.observes( 'username', 'password' )

});
