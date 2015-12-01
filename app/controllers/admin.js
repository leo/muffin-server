import Ember from 'ember';

export default Ember.Controller.extend({
	title: 'I\'m the title',
	tabs: true,
	actions: {
		openModal: function( target ) {
			var modal = this.get( 'modal-' + target );
			modal.send( 'toggleModal' );
		}
	}
});
