var fs = require('fs');
var juice = require('juice');

module.exports = function (body, output, filename) {
  if (fs.existsSync(filename)) {
    var inline = fs.readFileSync(filename, 'utf-8');
    body = juice.inlineContent(body, inline, {xmlMode:true});
  }
  output(body);
};