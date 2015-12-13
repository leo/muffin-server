import Ember from 'ember';
import Base from 'ember-simple-auth/authenticators/base';

const { RSVP } = Ember;

export default Base.extend({

  store: Ember.inject.service(),

  restore(data) {
    console.log(data);
  },

  authenticate(identification, password) {

    return new RSVP.Promise((resolve, reject) => {

      if (!identification || !password) {
        reject('Wrong username or password!');
      } else {
        resolve();
        this.store.queryRecord( 'user', { filter: { id: 'admin' } }).then(function(tomster) {});
      }

    });

  },

  invalidate(data) {
    console.log(data);
  }

});