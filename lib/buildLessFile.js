module.exports = function (i, o, from, to, variables) {
  if (fs.existsSync(from)) {
    var input = fs.readFileSync(from, 'utf-8');
    var less_options = { globalVars: variables };

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