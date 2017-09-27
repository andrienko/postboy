var $$ = function (html) { return require('cheerio').load(html,{decodeEntities:false, xmlMode:true}); };

module.exports = function(body, output, enabled){
  var $ = $$(body);

  $('tbl').each(function(){
    var newTag = $('<table></table>');
    var $this = $(this);
    var attrs = $this.attr();

    var cols = 1;
    if(typeof attrs.cols !== 'undefined')cols=attrs.cols;

    for(var attr in attrs){
      if(attrs.hasOwnProperty(attr)){
        newTag.attr(attr,attrs[attr]);
      }
    }

    $this.find('row').each(function(){
      var newTag = $('<tr></tr>');
      var $this = $(this);
      var attrs = $this.attr();
      var thisCols = 0;

      for(var attr in attrs){
        if(attrs.hasOwnProperty(attr)){
          newTag.attr(attr,attrs[attr]);
        }
      }

      $this.find('cell').each(function () {
        var newTag = $('<td></td>');
        var $this = $(this);
        var attrs = $this.attr();

        for(var attr in attrs){
          if(attrs.hasOwnProperty(attr)){
            newTag.attr(attr,attrs[attr]);
          }
        }

        $this.replaceWith(newTag.html($this.html()));

      })

      $this.replaceWith(newTag.html($this.html()));
    });

    $this.replaceWith(newTag.html($this.html()));
  });

  output($.html());
}