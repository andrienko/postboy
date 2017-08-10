var $$ = function (html) { return require('cheerio').load(html,{decodeEntities:false, xmlMode:true}); };

module.exports = function (body, output, enable) {
  if(enable){
    var $ = $$(body);
    $('[class]').each(function () {
      $(this).removeAttr('class');
    });
    body =  $.html();
  }
  output(body);
};