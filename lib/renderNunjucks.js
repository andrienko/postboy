var nunjucks = require('nunjucks');
var fs = require('fs');

module.exports = function (input, output, filename, options, variables) {
  if (!fs.existsSync(filename)) {
    output.error(filename+' not found.');
  }
  nunjucks.configure(options);
  console.log('Rendering nunjucks file '+filename);
  output(nunjucks.render(filename, variables));
};