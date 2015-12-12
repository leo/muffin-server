import PouchDB from 'pouchdb';
import { Adapter } from 'ember-pouch';

PouchDB.debug.enable( '*' );

var remote = new PouchDB( 'http://localhost:5984/muffin' );
var localDB = new PouchDB( 'muffin' );

localDB.sync(remote, {
  live: true,
  retry: true
});

export default Adapter.extend({
  db: localDB
});
