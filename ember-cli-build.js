/*jshint node:true*/
/* global require, module */

var EmberApp = require( 'ember-cli/lib/broccoli/ember-app' );

module.exports = function( defaults ) {

  var app = new EmberApp( defaults, {

    outputPaths: {
      app: {
        js: '/assets/app.js',
        css: {
          'app': '/assets/styles.css'
        }
      }
    },

    sourcemaps: {
      enabled: false
    },

    sassOptions: {
      outputStyle: 'expanded'
    },

    fingerprint: {
      enabled: false
    }

  });

  return app.toTree();

}
