import Ember from 'ember';

export default Ember.Route.extend({

	titleToken: 'Dashboard',

	renderTemplate() {

		this.render( 'admin', {
			controller: 'dashboard'
		});

	}

});
