import Ember from 'ember';

export default Ember.Route.extend({

	titleToken: 'Login',

	activate: function() {
		var controller = this.controllerFor( 'login' );
		controller.send( 'redirect' );
	}

});
