module.exports = function (body, output, enable) {
  if(enable){
    var $ = $$(body);
    $('[class]').each(function () {
      $(this).removeAttr('class');
    });
    body =  $.html();
  }
  output(body);
};