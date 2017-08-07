var cheerio = require('cheerio');

var $$ = function (html) {
  return cheerio.load(html,{decodeEntities:false, xmlMode:true});
};

module.exports = function (input, output, enable) {
  if(enable) {
    var $ = $$(input);
    $('a[href]:not(a[nowrap])').each(function () {
      $(this).html('<span class="anchor_wrap">' + $(this).html() + '</span>');
    });
    input = $.html();
  }

  output(input);
};