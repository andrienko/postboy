var fs = require('fs');


var $$ = function (html) { return require('cheerio').load(html,{decodeEntities:false, xmlMode:true}); };


module.exports = function (body, output, filename) {
  if (fs.existsSync(filename)) {
    var embed = fs.readFileSync(filename, 'utf-8');
    var style_tag = '<style type="text/css">' + embed + '</style>';

    var $ = $$(body);
    var head = $('head');
    if (head[0]) {
      head.append(style_tag);
      body = $.html();
    }
    else body += style_tag;
  }
  output(body);
};