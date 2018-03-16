module.exports = (function() {
  var mergeSingleTag = function (tagbody) {
    //console.log(tagbody);
    var classNames = [];

    var merged_classes = tagbody.replace(/class="(.*?)"/g, function (a, classAttr, c) {
      classAttr.split(/\s+/).forEach(function (className) {
        className = className.replace(/^\s*(.*)\s*$/, '$1');
        if (className && classNames.indexOf(className) == -1) classNames.push(className);
      })
      return '';
    });
    if (classNames.length)
      merged_classes += ' class="' + classNames.join(' ') + '"';

    var styles = '';
    merged = merged_classes.replace(/style="(.*?)"/g, function (a, styleAttr, c) {
      if (!(/.*;\s*/.test(styleAttr))) styleAttr += ';';
      styles += styleAttr;
      return '';
    });
    styles = styles.replace(/^\s*(.*)\s*$/, '$1');
    if (styles)
      merged += ' style="' + styles + '"';

    return merged;
  }

  var mergeStylesAndCss = function (body) {
    body = body.replace(/<\s*(\w+.*?(class|style).*?)\s*>/gm, function (a, b, c) {
      b = b.replace(/(class|style)\s*=\s*/g, '$1=');
      return '<' + b.replace(/.*(class|style)=".*?".*\1=".*?".*/g, function (a, b, c) {
        return mergeSingleTag(a);
      }) + '>';
    })
    return body;
  }

  return function(body, out, enabled){
    if(enabled) {  body = mergeStylesAndCss(body); }
    //require('fs').writeFileSync('./__merge_result.html',body);
    out(body);
  };

})();