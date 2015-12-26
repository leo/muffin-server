// Import some Broccoli plugins
var compileSass = require('broccoli-sass');
var esTranspiler = require('broccoli-babel-transpiler');
var mergeTrees = require('broccoli-merge-trees');
var funnel = require('broccoli-funnel');

// Specify the source directories
var sassDir = 'public/styles';
var jsDir = 'public/scripts';

// Tell Broccoli how we want the assets to be compiled
var styles = compileSass([sassDir], 'app.scss', 'styles.css', {
  outputStyle: 'compressed'
});

var scripts = esTranspiler(jsDir, {
  compact: true
});

var staticFiles = funnel('public', {
  exclude: ['scripts/*', 'styles/*']
});

// Merge the compiled styles and scripts into one output directory.
module.exports = mergeTrees([styles, scripts, staticFiles]);
