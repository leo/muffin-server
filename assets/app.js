window.App = Ember.Application.create({
	rootElement: 'body',
	LOG_TRANSITIONS: true
});

App.Router.reopen({
	rootURL: '/admin/'
});

App.Router.map( function() {

	this.resource( 'login', { path: '/' }, function() {
		this.route( 'new' );
	});

});

App.LoginRoute = Ember.Route.extend({

	activate: function() {
		$( 'body' ).addClass( 'login' );
	},

	renderTemplate: function() {

		this.render( 'login', {
			
		});

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
			this.set( 'loginStatus', 'error shake' );

			timeout = setTimeout( function() {
				this.set( 'loginStatus', 'error' );
			}.bind( this ), 1000);

		}

	}.bind( this ));

}

App.LoginController = Ember.Controller.extend({

	actions: {
		login: tryLogin
	}

});