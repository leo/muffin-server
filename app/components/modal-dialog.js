import Ember from 'ember';
import modalLayout from '../templates/components/modal-dialog';

export default Ember.Component.extend({

	classNames: [ 'media' ],
	classNameBindings: [ 'isOpen:open' ],
	attributeBindings: [ 'id' ],
	id: 'modal-dialog',

	isOpen: function() {
		return this.get( 'visibility' );
	}.property( 'visibility' ),

	expose: function() {
		var appController = this.get( 'targetObject' ),
			exposedName = 'modal-' + this.get( 'type' );
		appController.set( exposedName, this );
	}.on( 'init' ),

	init: function() {
		var store = this.get( 'targetObject.store' );

		this._super();
		this.set( 'model', store.findAll( 'file' ) );
	},

	actions: {
		toggleModal: function() {
			this.toggleProperty( 'visibility' );
			$( 'body' ).toggleClass( 'no-scroll' );
		}
	},

	layout: modalLayout,
	inModal: true

});
