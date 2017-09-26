var stamper = require('./lib/stamper');
var fs = require('fs');
var body = fs.readFileSync('./stamped.html','utf-8');

stamper(body, function(body){
  console.log(body);
})