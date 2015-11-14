import Ember from 'ember';

export default Ember.Route.extend({

	backend: true,

	renderTemplate: function() {

		//$( 'body' ).addClass( 'login' );
		this.render( 'dashboard' ); 

	}

});
