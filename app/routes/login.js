import Ember from 'ember';

export default Ember.Route.extend({

	renderTemplate() {
		$( 'body' ).addClass( 'login' );
		this.render( 'login' );
	}

});
