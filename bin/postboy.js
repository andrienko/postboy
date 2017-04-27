#!/usr/bin/env node
var proccess = require('process');
var path = require('path');
var fs = require('fs');
var minimist = require('minimist');
var recursiveCopy = require('recursive-copy');

var argv = minimist(process.argv.slice(2));
var cwd = proccess.cwd();
var options = {options:{},variables:{}};
var config_filename = path.resolve(cwd,'.postboy.js');

if(argv._[0] == 'init' && argv._[1] !== undefined){
  var newname = argv._[1].toLowerCase();
  var newpath = path.resolve(cwd,newname);
  if(!fs.existsSync(newpath)){
    var from = path.resolve(__dirname,'../init/**/*.*');
    console.log(from);
    fs.mkdirSync(newpath);
    recursiveCopy(from, newpath, function (error, results) {
      if(error){
        console.log('Error ',error);
      }
      console.log('done.');
    });
  } else {
    console.log('Path '+newpath+' already exists :(');
  }
} else {
  if(fs.existsSync(config_filename)){
    try {
      var config_file = require(config_filename);
      options = Object.assign(options, config_file);
    }
    catch (e){
      console.log('Error loading '+config_filename, e);
    }
  }

  var Postboy = require( path.resolve(__dirname,'..') );
  var instance = new Postboy(options.options, options.variables);
  instance.compile();
}

process.exit(0);