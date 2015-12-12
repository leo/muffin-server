import DS from 'ember-data';

export default DS.Model.extend({
  password: DS.attr( 'string' ),
  rev: DS.attr( 'string' )
});
