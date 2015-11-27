import Ember from 'ember';

export default Ember.Controller.extend({
	title: 'I\'m the title',
	actions: {
		openModal: function( target ) {
			var modal = this.get( 'comp-' + target );
			modal.send( 'toggleModal' );
		}
	}
});
