var nunjucks = require('nunjucks');
var fs = require('fs');

module.exports = function (input, output, filename, options, variables) {
  //console.log('####', filename);
  //console.log('Nunjucks variables: ', variables);
  var cwd = options.cwd || '.';
  if (!fs.existsSync(filename)) {
    output.error(filename+' not found.');
  }
  var renderer = new nunjucks.Environment(new nunjucks.FileSystemLoader(cwd), options);

  if(options.add_vars_global) {
    for (var vn in variables) {
      if (variables.hasOwnProperty(vn)) {
        renderer.addGlobal(vn, variables[vn]);
      }
    }
  }

  //nunjucks.configure(options);
  console.log('Rendering nunjucks file '+filename);
  try {
    var rendres = renderer.render(filename, variables);
    //fs.writeFileSync('./__nunjucks_result.html', rendres);
    output(rendres);
  } catch (e) {
    console.log('Nunjucks error', e);
  }
};