import Ember from 'ember';
import Unauthenticated from 'ember-simple-auth/mixins/unauthenticated-route-mixin';

export default Ember.Route.extend( Unauthenticated, {

	titleToken: 'Login',

	activate: function() {
		var controller = this.controllerFor( 'login' );
		controller.send( 'redirect' );
	}

});
