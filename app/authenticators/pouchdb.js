import Base from 'ember-simple-auth/authenticators/base';

export default Base.extend({

  restore(data) {
    alert('restore');
    console.log(data);
  },

  authenticate(identification, password, scope = []) {
    alert('authenticate');
    console.log(identification + password + scope);
  },

  invalidate( data ) {
    alert('invalidate');
    console.log(data);
  }

});