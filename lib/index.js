var juice = require('juice');
var fs = require('fs');
var nunjucks = require('nunjucks');
var cheerio = require('cheerio');
var path = require('path');

var default_options = {
  options: {
    entry: 'index.html',
    source: './',
    result: './result/',
    result_filename: 'index.html',
    css_embed: 'css/embed.css',
    css_inline: 'css/inline.css',
    include_file: 'common/macros.html',
    wrap_anchors: true,
    autoescape: false,
    strip_comments: true,
    beautify: false,
    remove_classes: true,
    replace_shorthand_colors: true
  },
  variables: {}
};

var App = function (options, variables) {
  this.options = Object.assign(default_options.options, options);
  this.variables = Object.assign(default_options.variables, variables);
};

App.prototype = {

  compile: function () {

    var file = path.resolve(this.options.source, this.options.entry);
    nunjucks.configure(this.options);

    //if(this.options.include_file)

    var result = nunjucks.render(file, this.variables);
    
    if(this.options.wrap_anchors){
      result = this.wrapAnchors(result);
    }

    result = this.inlineFile(result, this.options.source + this.options.css_inline);
    result = this.embedStyleFile(result, this.options.source + this.options.css_embed);
    

    if(this.options.remove_classes){
      result = this.removeClasses(result);
    }
    if(this.options.strip_comments){
      result = result.replace(/<!--[\s\S]*?-->/gm,'');
    }
    if(this.options.replace_shorthand_colors){ result = this.replaceShorthandColors(result); }

    var result_path = path.resolve(this.options.result, this.options.result_filename);
    fs.writeFileSync(result_path, result, 'utf-8');
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
    var regex = /#([a-f0-9])([a-f0-9])([a-f0-9])([^a-f0-9])/ig;
    return html.replace(regex,'#$1$1$2$2$3$3$4');
  },

  wrapAnchors: function(html){
    var $ = cheerio.load(html);
    $('a[href]:not(a[nowrap])').each(function(){
      $(this).html('<span class="anchor_wrap">' + $(this).html() + '</span>');
    });
    return $.html();
  },

  removeClasses: function(html){
    var $ = cheerio.load(html);
    $('[class]').each(function(){
      $(this).removeAttr('class');
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