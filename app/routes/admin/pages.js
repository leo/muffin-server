import Ember from 'ember';

export default Ember.Route.extend({
	titleToken: 'Pages',
	model() {
		return this.store.findAll( 'page' );
	}
});
