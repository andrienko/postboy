var juice = require('juice');
var fs = require('fs');
var nunjucks = require('nunjucks');
var cheerio = require('cheerio');
var path = require('path');
var less = require('less');
//var sanitizeHtml = require('sanitize-html');
var htmlBeautify = require('html-beautify');

var taj = require('taj');

var $$ = function (html) {
  return cheerio.load(html,{decodeEntities:false, xmlMode:true});
};

// TODO: Separate nunjucks settings from postboy settings
// TODO: Clean code

var default_options = {
  options: {
    entry: 'index.njk',
    source: './',
    result: './result/',
    result_filename: 'index.html',

    css_embed: 'css/embed.css',
    less_embed: 'css/embed.less',
    css_inline: 'css/inline.css',
    less_inline: 'css/inline.less',

    wrap_anchors: true,
    autoescape: false,
    strip_comments: true,
    beautify: false,
    remove_classes: true,
    replace_shorthand_colors: true
  },
  variables: {}
};

var methods = {

  renderNunjucks: function (input, output, filename, options, variables) {
    if (!fs.existsSync(filename)) {
      output.error(filename+' not found.');
    }
    nunjucks.configure(options);
    console.log('Rendering nunjucks file '+filename);
    output(nunjucks.render(filename, variables));
  },

  wrapAnchors:function (input, output, enable) {
    if(enable) {
      var $ = $$(input);
      $('a[href]:not(a[nowrap])').each(function () {
        $(this).html('<span class="anchor_wrap">' + $(this).html() + '</span>');
      });
      input = $.html();
    }

    output(input);
  },

  buildLessFile:function (i, o, from, to, variables) {
    if (fs.existsSync(from)) {
      var input = fs.readFileSync(from, 'utf-8');
      var less_options = { globalVars: variables };

      less.render(input, less_options)
        .then(function (output) {
            fs.writeFileSync(to, output.css, 'utf-8');
            o.pass();
          },
          function (error) {
            o.error(error);
            o.pass();
          }
        );
    }
    else {
      o.pass();
    }
  },

  inlineStyles:function (body, output, filename) {
    if (fs.existsSync(filename)) {
      var inline = fs.readFileSync(filename, 'utf-8');
      body = juice.inlineContent(body, inline, {xmlMode:true});
    }
    output(body);
  },

  embedStyles:function (body, output, filename) {
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
  },

  removeClasses: function (body, output, enable) {
    if(enable){
      var $ = $$(body);
      $('[class]').each(function () {
        $(this).removeAttr('class');
      });
      body =  $.html();
    }
    output(body);
  },

  stripComments: function (body, output, enable) {
    output(enable ? body.replace(/<!--[\s\S]*?-->/gm, '') : body );
  },

  replaceShorthandColors: function (body, output, enable) {
    if(enable) {
      var regex = /#([a-f0-9])([a-f0-9])([a-f0-9])([^a-f0-9])/ig;
      body = body.replace(regex, '#$1$1$2$2$3$3$4');
    }

    output(body);
  }
};


var App = function (options, variables, less_variables, cwd) {
  this.cwd = cwd || path.resolve('.');
  this.less_variables = less_variables || {};
  this.env_vars = [];
  this.options = Object.assign(default_options.options, options);
  this.variables = Object.assign(default_options.variables, variables);
};

App.prototype = {

  compile: function () {

    var options = this.options;
    var app = this;
    var less_variables = this.less_variables;

    var file = path.resolve(options.source, options.entry);

    var variables = this.variables;

    this.env_vars.forEach(function (envvar) {
      variables[envvar] = variables[envvar] || true;
    });

    var chain = new taj('',methods);

    var css_inline_path = path.resolve(options.source, options.css_inline);
    var less_inline_path = path.resolve(options.source, options.less_inline);
    var css_embed_path = path.resolve(options.source, options.css_embed);
    var less_embed_path = path.resolve(options.source, options.less_embed);

    chain.onError(function () {
      console.log.apply(console,[].slice.call(arguments))
    });

    chain
      .renderNunjucks(file,options,variables)
      .wrapAnchors(this.options.wrap_anchors)
      .buildLessFile(css_inline_path, less_inline_path, less_variables)
      .buildLessFile(css_embed_path, less_embed_path, less_variables)
      .inlineStyles(css_inline_path)
      .embedStyles(css_embed_path)
      .removeClasses(options.remove_classes)
      .stripComments(options.strip_comments)
      .replaceShorthandColors(options.replace_shorthand_colors)
      .go(function (result) {
        var result_path = path.resolve(options.result, options.result_filename);
        console.log('Writing '+result_path);
        fs.writeFileSync(result_path, result, 'utf-8');
      });









    //result = this.mergeStyles(result);

      // if (options.sanitize){result = sanitizeHtml(result, {
      //     allowedTags: false,
      //     allowedAttributes: false,
      //     allowedSchemes: false
      //   });
      //}

      // if (this.options.beautify) {
      //   var tidy = require('htmltidy2').tidy;
      //   result = htmlBeautify(result)
      // };


  },

  envVars: function(vars){
    this.env_vars = vars;
  },

  mergeStyles: function (html) {
    html = html.replace(/<[a-zA-Z]+(>|.*?[^?]>)/g, function (tag) {
      ['class'].forEach(function (attr) {
        var regex = (new RegExp(attr+'\\s*=\\s*"(.*?)"','ig'));
        var m;
        while ((m = regex.exec(tag)) !== null) {
          if (m.index === regex.lastIndex) { regex.lastIndex++; }
          m.forEach(function(match, groupIndex) {
            if(groupIndex)console.log(match);
          });
        }
      });
      return tag;
    });
    return html;
  }

};

module.exports = App;