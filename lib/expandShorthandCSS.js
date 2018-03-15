var postcss = require('postcss');
var shorthandExpand = require('postcss-shorthand-expand');
var $$ = function (html) { return require('cheerio').load(html,{decodeEntities:false, xmlMode:true}); };

module.exports = function (body, out, enabled){
  if(enabled){
    var $ = $$(body);
    $('[style]').each(function(){
      var $this = $(this);
      var expanded = postcss([shorthandExpand()]).process('{'+$this.attr('style')+'}').css.slice(1,-1);
      expanded = expanded
        .replace(/"(\S+)"/g,'$1')
        .replace(/"/g,'&quot;');

      $this.attr('style',expanded);
    });
    body = $.html();
  };
  out(body);
};