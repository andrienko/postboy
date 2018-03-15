var fs = require('fs');
var merge = require('lodash.merge');
var less = require('less');
var path = require('path');

module.exports = function (i, o, to, from, options) {
  if (fs.existsSync(from)) {
    // console.log('Building less file '+from+' with', variables);
    var input = fs.readFileSync(from, 'utf-8');

    var less_variables = options.less_variables || {};
    var less_options = merge(
      {
        modifyVars: less_variables,
        filename: path.resolve(from)
        //rootpath: path.resolve(options.source)
      },
      options.less || {}
    );

    console.log('LESS options: ', less_options);

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