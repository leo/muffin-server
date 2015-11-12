import Ember from 'ember';

export default Ember.Route.extend({
	renderTemplate: function() {
		$( 'body' ).addClass( 'login' );
		this.render( 'login' );
	}
});
