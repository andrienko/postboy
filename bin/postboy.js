#!/usr/bin/env node

var proccess = require('process');
var path = require('path');
var fs = require('fs');
var minimist = require('minimist');
var recursiveCopy = require('recursive-copy');

var argv = minimist(process.argv.slice(2));
var cwd = proccess.cwd();
var options = {};

var config_filename = path.resolve(cwd, '.postboy');
if (!fs.existsSync(config_filename)) config_filename = path.resolve(cwd, 'postboy.config.js');
if (!fs.existsSync(config_filename)) config_filename = path.resolve(cwd, 'postboy.config.json');

if (argv._[0] == 'init') {
  var newname = argv._[1] || '.';
  var newpath = path.resolve(cwd, newname.toLowerCase());
  if (!fs.existsSync(newpath)) {
    fs.mkdirSync(newpath);
  }

  var from = path.resolve(__dirname, '../init');

  recursiveCopy(from, newpath, {dot:true},function (error, results) {
    if (error) {
      if(error.code === 'EEXIST'){
        console.log('Some files, one of which is '+ error.path + ', already exist.');
      }
      else {
        console.log('Error ', error);
      }
    }
    console.log('Initialized in ' + newpath);
  });

} else {
  if (fs.existsSync(config_filename)) {
    try {
      console.log('Loading config from ' + config_filename);
      var config_file = require(config_filename);
      options = Object.assign(options, config_file);
    }
    catch (e) {
      console.log('Error loading ' + config_filename, e);
    }
  } else {
    console.log(config_filename + ' not found. Using default config.');
  }

  var Postboy = require(path.resolve(__dirname, '..'));
  var instance = new Postboy(options, cwd, argv._);
  instance.compile();
}