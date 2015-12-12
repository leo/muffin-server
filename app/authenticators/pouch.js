import Ember from 'ember';
import Base from 'ember-simple-auth/authenticators/base';

const { RSVP, isEmpty, run } = Ember;

export default Base.extend({

  restore(data) {

  },

  authenticate(identification, password, scope = []) {

    return new RSVP.Promise((resolve, reject) => {

      if (!identification || !password) {
        reject('Wrong username or password!');
      }

      resolve();

    });

  },

  invalidate( data ) {

  }

});