

var juice = require('juice');
var fs = require('fs');
var nunjucks = require('nunjucks');
var extend = require('extend');
var cheerio = require('cheerio');

var default_options = {
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
    img: 'http://fu.cc.ua/ml',
    title: 'E-mail'
  }
};

var App = function (options, variables) {
  this.options = options;
  this.variables = variables;

};

App.prototype = {

  compile: function (file) {

    nunjucks.configure(this.options.source);

    //if(this.options.include_file)

    var result = nunjucks.render(file, this.variables);
    
    if(this.options.wrap_anchors){
      result = this.wrapAnchors(result);
    }

    result = this.inlineFile(result, this.options.source + this.options.css_inline);
    result = this.embedStyleFile(result, this.options.source + this.options.css_embed);
    
    if(this.options.replace_shorthand_colors){
      result = this.replaceShorthandColors(result);
    }

    
    
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

var pboy_options = require('../postboy.js');
var options = extend(true, pboy_options, default_options);


var test = new App(options.options, options.variables);

test.compile('index.html');
process.exit();