var Entities = require('special-entities');

module.exports = function (body, output, enable) {
  if(enable){
    body = Entities.normalizeXML( body, 'numeric');
  }
  output( body );
};