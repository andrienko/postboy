var mkdirp = require('mkdirp');
var path = require('path');
var less = require('less');
var fs = require('fs');
var merge = require('lodash.merge');

var taj = require('taj');

// TODO: Clean code

var App = function (options, cwd, envVars) {
  this.cwd = cwd || path.resolve('.');
  var default_options = require('./defaultOptions');
  this.options = merge({}, default_options, options);
  this.envVars = envVars || {};
  if (options.variables) {
    this.options.variables = merge({}, this.options.variables, options.variables);
    if (options.less && options.less_vars_to_nunjucks) {
      this.options.variables = merge({}, this.options.less, this.options.variables);
      this.log('added less variables:', this.options.less);
    }
  }

  this.chain = new taj('', {
    renderNunjucks: require('./renderNunjucks'),
    wrapAnchors: require('./wrapAnchors'),
    buildLessFile: require('./buildLessFile'),
    inlineStyles: require('./inlineStyles'),
    embedStyles: require('./embedStyles'),
    removeClasses: require('./removeClasses'),
    mergeStyles: require('./mergeStyles'),
    stripComments: require('./stripComments'),
    replaceShorthandColors: require('./replaceShorthandColors'),
    xmlEntities: require('./xmlEntities'),
    expandShorthandCSS: require('./expandShorthandCSS')
  });

};

App.prototype = {

  log: function () {
    if(this.options.debug){
      console.log.apply(console,arguments);
    }
  },
  compile: function () {

    var file = path.resolve(this.options.source, this.options.entry);
    var app = this;

    var css_inline_path = path.resolve(this.options.source, this.options.css_inline);
    var less_inline_path = path.resolve(this.options.source, this.options.less_inline);
    var css_embed_path = path.resolve(this.options.source, this.options.css_embed);
    var less_embed_path = path.resolve(this.options.source, this.options.less_embed);

    this.chain.onError(function (err) {
      console.log(err);
    });

    this.chain
    .renderNunjucks(file, this.options.nunjucks, this.options.variables)
    .mergeStyles(this.options.merge_styles)
    .wrapAnchors(this.options.wrap_anchors)
    .buildLessFile(css_inline_path, less_inline_path, this.options.less)
    .buildLessFile(css_embed_path, less_embed_path, this.options.less)
    .inlineStyles(css_inline_path)
    .embedStyles(css_embed_path)
    .removeClasses(this.options.remove_classes)
    .stripComments(this.options.strip_comments)
    .replaceShorthandColors(this.options.replace_shorthand_colors)
    .expandShorthandCSS(this.options.expand_shorthand_css)
    .xmlEntities(this.options.replace_html_entities)
    .go(function (result) {
      if(result==''){
        console.log('Result was empty. Did something go wrong?');
        return;
      }
      var result_path = path.resolve(app.options.result_dir, app.options.result_filename);
      console.log('Writing ' + result_path);
      mkdirp.sync(app.options.result_dir);
      fs.writeFileSync(result_path, result, 'utf-8');

      var stats = fs.statSync(result_path);
      var fileSizeInBytes = stats.size;
      console.log('The file is '+fileSizeInBytes+' bytes ('+Math.ceil(fileSizeInBytes/1024)+'kb)');
      if(fileSizeInBytes/1024 < 102)console.log('The mail is now so small it won\'t even get clipped! Awesome');

    });

  }
};

module.exports = App;