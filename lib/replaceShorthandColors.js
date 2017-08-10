module.exports = function (body, output, enable) {
  if(enable) {
    var regex = /#([a-f0-9])([a-f0-9])([a-f0-9])([^a-f0-9])/ig;
    body = body.replace(regex, '#$1$1$2$2$3$3$4');
  }
  output(body);
};