window.App = Ember.Application.create();

App.Router.reopen({
	rootURL: '/admin/'
});

App.Router.map( function() {
	this.route( 'index', { path: '/' } );
});

App.IndexRoute = Ember.Route.extend({

	activate: function() {
		$( 'body' ).addClass( 'login' );
	},

	renderTemplate: function() {

		this.render( 'admin', {
			controller: 'dashboard'
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
			this.set( 'loginStatus', 'shake' );

			$( 'input' ).addClass( 'wrong' );

			timeout = setTimeout( function() {
				this.set( 'loginStatus', '' );
			}.bind( this ), 1000);

		}

	}.bind( this ));

}

var setClasses = function( top, which ) {
	var type = which == 'password' ? 'password' : 'text';
	$( 'input[type="' + type + '"]' ).removeClass( 'wrong' );
}

App.LoginController = Ember.Controller.extend({

	actions: {
		login: tryLogin
	},

	checkError: setClasses.observes( 'username', 'password' )

});

App.DashboardController = Ember.Controller.extend({
	content: 'dashboard',
	divide: 'columns equal'
});