var fs = require('fs');
var less = require('less');

module.exports = function (i, o, to, from, variables) {
  if (fs.existsSync(from)) {
    console.log('Building less file '+from+' with', variables);
    var input = fs.readFileSync(from, 'utf-8');
    var less_options = { modifyVars: variables };
    less.render(input, less_options)
      .then(function (output) {
          fs.writeFileSync(to, output.css, 'utf-8');
          o.pass();
        },
        function (error) {
          o.error(error);
          o.pass();
        }
      );
  }
  else {
    o.pass();
  }
};