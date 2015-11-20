import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
    location: config.locationType
});

Router.reopen({

});

Router.map(function() {
	this.route( 'login', { path: '/' } );
	this.route( 'dashboard' );
	this.route( 'list' );
	this.route( 'media' );
});

export default Router;
