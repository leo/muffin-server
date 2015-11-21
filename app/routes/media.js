import Ember from 'ember';

export default Ember.Route.extend({

	titleToken: 'Media',

	renderTemplate() {

		this.render( 'admin', {
			controller: 'media'
		});

	},

	model() {
		return this.store.findAll( 'file' );
	}

});
