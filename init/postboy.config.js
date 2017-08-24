//var img = 'http://yourserver.com/images';
var img = '../img';

module.exports = {
  strip_comments: false,
  less_vars_to_nunjucks: true,
  variables:{
    img: img,
    grey: '#efefef',
    title:'Test e-mail',
    indent:'<div style="margin: 0; padding: 0; line-height: 0;font-size:0px;">&nbsp;</div>',
    indent2: '<div style="margin: 0; padding: 0; line-height: 0;"><img src="' + img + '/indent.gif" border="0" width="1" height="1" style="display: block;" alt=""/></div>',
    vab: 'valign="bottom" class="align-bottom"',
    vat: 'valign="top" class="align-top"',
    w100p: 'style="width:100%" width="100%"',
    tblt: 'cellspacing="0" cellpadding="0" border="0"',
  },
  less:{
    img:img
  }
};