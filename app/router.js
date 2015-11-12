import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
	location: config.locationType
});

Router.reopen({
	rootURL: '/admin/'
});

Router.map(function() {

});

export default Router;
