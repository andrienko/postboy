module.exports = {
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