var recursiveCopy = require('recursive-copy');
var fs = require('fs');
var path = require('path');

module.exports = function(newpath){
  if (!fs.existsSync(newpath)) {
    fs.mkdirSync(newpath);
  }
  var from = path.resolve(__dirname, '../init');
  recursiveCopy(from, newpath, {dot: true}, function (error, results) {
    if (error) {
      if (error.code === 'EEXIST') {
        console.log('Some files, one of which is ' + error.path + ', already exist.');
      }
      else {
        console.log('Error ', error);
      }
    }
    console.log('Initialized in ' + newpath);
  });
};