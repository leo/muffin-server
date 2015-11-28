import Ember from 'ember';

export default Ember.Route.extend({
	titleToken: function( model ) {
		return model.get( 'title' );
	},
	model: function( params ) {
		return this.store.findRecord( 'page', params.page_id );
	}
});
