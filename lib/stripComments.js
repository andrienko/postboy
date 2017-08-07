module.exports = function (body, output, enable) {
  output(enable ? body.replace(/<!--[\s\S]*?-->/gm, '') : body );
};