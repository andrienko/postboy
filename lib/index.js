var juice = require('juice');
var fs = require('fs');
var nunjucks = require('nunjucks');
var extend = require('extend');
var cheerio = require('cheerio');

var App = function (options, variables) {
  this.options = extend(true, App.default_options.options, options);
  this.variables = extend(true, App.default_options.variables, variables);
};

App.default_options = {
  options: {
    source: './source/',
    result: './result/',
    css_embed: 'css/embed.css',
    css_inline: 'css/inline.css',
    include_file: 'common/macros.html',
    wrap_anchors: true,
    strip_comments: true,
    replace_shorthand_colors: true
  },
  variables: {
    img: 'img',
    outer: 600,
    title: 'E-mail'
  }
};


App.prototype = {

  compile: function (file) {

    nunjucks.configure(this.options.source);

    var file_contents = fs.readFileSync(this.options.source + file, 'utf-8')
    if(this.options.include_file) file_contents = '{% include "'+this.options.include_file+'"%}' + "\r\n" + file_contents;
    
    var result = nunjucks.renderString(file_contents, this.variables);

    if(this.options.wrap_anchors){
      result = this.wrapAnchors(result);
    }

    result = this.inlineFile(result, this.options.source + this.options.css_inline);

    if(this.options.replace_shorthand_colors){
      result = this.replaceShorthandColors(result);
    }

    result = this.embedStyleFile(result, this.options.source + this.options.css_embed);

    if(this.options.strip_comments){
      result = result.replace(/<!--[\s\S]*?-->/gm,'');
    }

    var filename = this.options.result + file;
    fs.writeFileSync(filename, result, 'utf-8');
  },

  inlineFile: function (html, file) {
    if (fs.existsSync(file)) {
      var inline = fs.readFileSync(file, 'utf-8');
      html = juice.inlineContent(html, inline);
    }
    return html;
  },

  replaceShorthandColors: function(html){
    // Any better way to do this? ;-)
    var regex = /#([a-f0-9])([a-f0-9])([a-f0-9])[^a-f0-9]/ig;
    return html.replace(regex,'#$1$1$2$2$3$3');
  },

  wrapAnchors: function(html){
    var $ = cheerio.load(html);
    $('a[href]:not(a[nowrap])').each(function(){
      $(this).html('<span class="anchor_wrap">' + $(this).html() + '</span>');
    });
    return $.html();
  },

  embedStyleFile: function(html, file){
    if(fs.existsSync(file)){
      var embed = fs.readFileSync(file, 'utf-8');
      var style_tag = '<style type="text/css">' + embed + '</style>';

      var $ = cheerio.load(html);
      var head = $('head');
      if(head[0]){
        head.append(style_tag);
        html = $.html();
      }
      else html += style_tag;
    }
    return html;
  }

};

module.exports = App;