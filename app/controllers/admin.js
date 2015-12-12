import Ember from 'ember';

export default Ember.Controller.extend({
  title: 'I\'m the title',
  tabs: true,
  init: function() {

    /*

    var media = this.store.createRecord( 'file', {
      url: 'assets/sample.png'
    });

    media.save();

    */

  },
  actions: {
    openModal: function( target ) {
      var modal = this.get( 'modal-' + target );
      modal.send( 'toggleModal' );
    }
  }
});
