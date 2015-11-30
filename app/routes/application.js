import Ember from 'ember';

import SimpleAuth from 'ember-simple-auth/mixins/application-route-mixin';
import BodyClass from 'ember-body-class/mixins/body-class';

export default Ember.Route.extend( SimpleAuth, BodyClass, {

	title: function( tokens ) {
		return tokens.join( ' ― ' ) + ' ― Muffin';
	}

});
