import Ember from 'ember';
import modalLayout from '../templates/components/modal-dialog';

export default Ember.Component.extend({

	expose: function() {
		var appController = this.get( 'targetObject' ),
			exposedName = 'comp-' + this.get( 'id' );
		appController.set( exposedName, this );
	}.on( 'init' ),

	init: function() {
		var store = this.get( 'targetObject.store' );

		this._super();
		this.set( 'model', store.findAll( 'file' ) );
	},

	actions: {
		toggleModal: function() {
			this.toggleProperty( 'enabled' );
		}
	},

	layout: modalLayout,
	inModal: true

});
