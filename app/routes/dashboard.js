import Ember from 'ember';

export default Ember.Route.extend({

	activate() {
		$( 'body' ).removeClass( 'login' )
	},

	renderTemplate() {
		this.render( 'admin', {
			controller: 'dashboard'
		});
	}

});
