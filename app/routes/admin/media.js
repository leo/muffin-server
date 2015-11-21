import Ember from 'ember';

export default Ember.Route.extend({

	titleToken: 'Media',

	model() {
		return this.store.findAll( 'file' );
	}

});
