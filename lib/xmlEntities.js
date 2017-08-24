var Entities = require('special-entities');

module.exports = function (body, output, enable) {
  output( Entities.normalizeXML( body, 'numeric') )
};