//var img = 'http://yourserver.com/images';
var img = '../img';

module.exports = {
  variables:{
    img: img,
    grey: '#efefef',
    title:'Test e-mail',
    indent: '<div style="margin: 0; padding: 0; line-height: 0;"><img src="' + img + '/indent.gif" border="0" width="1" height="1" style="display: block;" alt=""/></div>'
  },
  less:{
    img:img
  }
};