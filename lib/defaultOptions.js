module.exports = {

  entry: 'index.njk',
  source: './',

  result_dir: './result/',
  result_filename: 'index.html',

  css_embed: 'css/embed.css',
  less_embed: 'css/embed.less',
  css_inline: 'css/inline.css',
  less_inline: 'css/inline.less',

  wrap_anchors: true,

  strip_comments: true,
  beautify: false,
  remove_classes: true,
  replace_shorthand_colors: true,
  less_vars_to_nunjucks: false,
  replace_html_entities: true,
  expand_shorthand_css: true,

  variables: {
    indent: '<div style="margin: 0; padding: 0; line-height: 0;font-size:0;">&nbsp;</div>'
  },
  nunjucks: {
    autoescape: false,
    add_vars_global: true
  },
  less: {}
};