

var path = require('path');
var less = require('less');
//var sanitizeHtml = require('sanitize-html');
var htmlBeautify = require('html-beautify');

var taj = require('taj');


// TODO: Separate nunjucks settings from postboy settings
// TODO: Clean code

var default_options = require('./defaultOptions');

var methods = {
  renderNunjucks: require('./renderNunjucks'),
  wrapAnchors:require('./wrapAnchors'),
  buildLessFile: require('./buildLessFile'),
  inlineStyles: require('./inlineStyles'),
  embedStyles:require('./embedStyles'),
  removeClasses: require('./removeClasses'),
  stripComments: require('./stripComments'),
  replaceShorthandColors: require('./replaceShorthandColors')
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