// Import some Broccoli plugins
var compileSass = require('broccoli-sass');
var esTranspiler = require('broccoli-babel-transpiler');
var mergeTrees = require('broccoli-merge-trees');

// Specify the source directories
var sassDir = 'public/styles';
var babelDir = 'public/scripts';

// Tell Broccoli how we want the assets to be compiled
var styles = compileSass([sassDir], 'admin.scss', 'styles.css');
var scripts = esTranspiler(babelDir);

// Merge the compiled styles and scripts into one output directory.
module.exports = mergeTrees([styles, scripts]);
