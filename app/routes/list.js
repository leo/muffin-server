import Ember from 'ember';

export default Ember.Route.extend({

	titleToken: 'List',

	renderTemplate() {

		this.render( 'admin', {
			controller: 'list'
		});

	}

});
