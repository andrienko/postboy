var mkdirp = require('mkdirp');
var path = require('path');
var less = require('less');
//var sanitizeHtml = require('sanitize-html');
var htmlBeautify = require('html-beautify');
var fs = require('fs');

var taj = require('taj');

// TODO: Clean code

var App = function (options,cwd, envVars) {
  this.cwd = cwd || path.resolve('.');
  var default_options = require('./defaultOptions');
  this.options = Object.assign(default_options, options);
  this.envVars = envVars || {};
  if(options.variables) {
    this.options.variables = Object.assign(this.options.variables, options.variables)
  }
};

App.prototype = {

  compile: function () {

    var file = path.resolve(this.options.source, this.options.entry);
    var app = this;

    var chain = new taj('', {
      renderNunjucks: require('./renderNunjucks'),
      wrapAnchors:require('./wrapAnchors'),
      buildLessFile: require('./buildLessFile'),
      inlineStyles: require('./inlineStyles'),
      embedStyles:require('./embedStyles'),
      removeClasses: require('./removeClasses'),
      stripComments: require('./stripComments'),
      replaceShorthandColors: require('./replaceShorthandColors'),
      xmlEntities:require('./xmlEntities')
    });

    var css_inline_path = path.resolve(this.options.source, this.options.css_inline);
    var less_inline_path = path.resolve(this.options.source, this.options.less_inline);
    var css_embed_path = path.resolve(this.options.source, this.options.css_embed);
    var less_embed_path = path.resolve(this.options.source, this.options.less_embed);

    chain.onError(function () {
      console.log.apply(console,[].slice.call(arguments))
    });

    chain
      .renderNunjucks(file,this.options.nunjucks,this.options.variables)
      .wrapAnchors(this.options.wrap_anchors)
      .buildLessFile(css_inline_path, less_inline_path, this.options.less)
      .buildLessFile(css_embed_path, less_embed_path, this.options.less)
      .inlineStyles(css_inline_path)
      .embedStyles(css_embed_path)
      .removeClasses(this.options.remove_classes)
      .stripComments(this.options.strip_comments)
      .replaceShorthandColors(this.options.replace_shorthand_colors)
      .xmlEntities(this.options.replace_html_entities)
      .go(function (result) {
        var result_path = path.resolve(app.options.result_dir, app.options.result_filename);
        console.log('Writing '+result_path);
        mkdirp.sync(app.options.result_dir);
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


  }
  /*,

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
  }*/

};

module.exports = App;