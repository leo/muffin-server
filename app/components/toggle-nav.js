import Ember from 'ember';

export default Ember.Component.extend({

	tagName: 'a',
	classNames: [ 'toggle' ],
	attributeBindings: [ 'href' ],
	href: '#',

	click: function( event ) {

		var button = $( event.target ).closest( '.toggle' );

		$( button ).prevAll( 'nav' ).slideToggle( 300 );
		$( button ).toggleClass( 'on' );

		event.preventDefault();

	}

});
