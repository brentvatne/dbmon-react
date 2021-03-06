process.env.NODE_ENV = 'production';

var path = require('path');
var rimrafSync = require('rimraf').sync;
var webpack = require('webpack');
var config = require('../webpack.config.prod');

var isInNodeModules = 'node_modules' ===
  path.basename(path.resolve(path.join(__dirname, '..', '..')));
var relative = isInNodeModules ? '../..' : '.';
rimrafSync(relative + '/build');

webpack(config).run(function(err, stats) {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  console.log('Successfully generated a bundle in the build folder!');
  console.log();
  console.log('You can now serve it with any static server:');
  console.log('  cd build');
  console.log('  python -m SimpleHTTPServer 9000');
  console.log('  open http://localhost:9000');
  console.log();
  console.log('It is optimized and ready to be deployed for production.');
});
