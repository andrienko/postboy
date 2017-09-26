var $$ = function (html) { return require('cheerio').load(html,{decodeEntities:false, xmlMode:true}); };

module.exports = function(body, output, enabled){
  var $ = $$(body);
  $('row').each(function(){
    var newTag = $('<div></div>');
    var $this = $(this);
    var attrs = $this.attr();
    for(var attr in attrs){
      if(attrs.hasOwnProperty(attr)){
        newTag.attr(attr,attrs[attr]);
      }
    }
    newTag.html($this.html());
    $this.replaceWith(newTag);
  });
  output($.html());
}