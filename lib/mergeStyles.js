module.exports = (function(){
  var mergeParser = function(body){
    this.n = 0;
    this.tagGoing = false;
    this.tagGoingStart = 0;
    this.tagBody = '';
    this.newBody = '';
    this.argGoing = false;
    this.body = body;
  };
  mergeParser.prototype = {
    workTagBody: function () {
      if(!this.tagBody.match(/^\s*\/.*$/)) {
        this.tagBody = mergeClasses(mergeStyles(this.tagBody));
      }
    },
    nextSymbol: function () {
      var smb = this.body.slice(this.n,this.n+1);

      if(this.tagGoing)this.tagBody += smb;
      else if(smb!='<')this.newBody+=smb;

      if(this.tagGoing && smb == '"'){
        this.argGoing = !this.argGoing;
      }
      if(smb == '<' && !this.tagGoing && !this.argGoing){
        this.tagGoingStart = this.n;
        this.tagGoing = true;
        this.tagBody = '';
      } else if(smb =='>' && this.tagGoing && !this.argGoing){
        this.tagGoing = false;
        this.argGoing = false;
        this.tagBody = this.tagBody.slice(0,-1);
        this.workTagBody();
        this.newBody+='<'+this.tagBody+'>';
      }

      this.n++;

      if(this.n<this.body.length){
        this.nextSymbol();
      }
    }
  };

  var mergeClasses = function(tagBody){
    var initialBody = tagBody;
    var classRegex = (new RegExp('class\\s*=\\s*"(.*?)"','ig'));
    var classnames = [];
    var replaces = 0;
    tagBody = tagBody.replace(classRegex, function(whole,classnames_string,c,n){
      replaces++;
      classnames_string.split(/\s+/).forEach(function (classname) {
        if(classnames.indexOf(classname) === -1){
          classnames.push(classname);
        }
      });
      return '';
    });
    if(classnames.length>0){
      tagBody+= ' class="'+classnames.join(' ')+'"';
    }
    if(replaces<2)return initialBody;
    return tagBody;
  };

  var mergeStyles = function(tagBody){
    var initialBody = tagBody;
    var styleRegex = (new RegExp('style\\s*=\\s*"(.*?)"','ig'));
    var styles = [];
    var replaces = 0;
    tagBody = tagBody.replace(styleRegex, function(whole,style_string,c,n){
      replaces++;
      style_string.split(/\s+/).forEach(function (style) {
        if(styles.indexOf(style) === -1){
          if(!style.match(/^.*;\s*$/))style+=';';
          styles.push(style);
        }
      });
      return '';
    });

    if(replaces<2)return initialBody;
    if(styles.length>0){
      tagBody+= ' style="'+styles.join(' ')+'"';
    }
    return tagBody;
  };


  var a = 4;

  return function(body, out, enable){
    if(enable) {
      var parser = new mergeParser(body);
      parser.nextSymbol();
      body = parser.newBody;
    }
    out(body);
  };

})();