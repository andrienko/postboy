var nunjucks = require('nunjucks');
var fs = require('fs');

module.exports = function (input, output, filename, options, variables) {
  console.log('####', filename);
  if (!fs.existsSync(filename)) {
    output.error(filename+' not found.');
  }
  nunjucks.configure(options);
  console.log('Rendering nunjucks file '+filename);
  try {
    var rendres = nunjucks.render(filename, variables);
    output(rendres);
  } catch (e) {
    console.log('Nunjucks error', e);
  }
};