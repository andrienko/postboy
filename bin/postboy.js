#!/usr/bin/env node

var proccess = require('process');
var path = require('path');
var fs = require('fs');
var minimist = require('minimist');
var merge = require('lodash.merge');

var argv = minimist(process.argv.slice(2));
var cwd = proccess.cwd();
var options = require(path.resolve(__dirname,'../lib/defaultOptions.js'));

var config_filename = path.resolve(cwd, '.postboy');
if (!fs.existsSync(config_filename)) config_filename = path.resolve(cwd, 'postboy.config.js');
if (!fs.existsSync(config_filename)) config_filename = path.resolve(cwd, 'postboy.config.json');

if (argv._[0] === 'init') {
  require('./init.js')(path.resolve(cwd, (argv._[1] || '.').toLowerCase()));
} else if(argv._[0] === 'h' || argv['h'] || argv['help'] || argv._[0] === 'help' || argv._[0] === '?') {
  var help = fs.readFileSync(path.resolve(__dirname,'./help.txt'),'utf-8');
  console.log(help);
} else if(argv._[0] === 'v' || argv['v'] || argv['version'] || argv._[0] === 'version') {
  var pkg = require('../package.json');
  console.log('v' + pkg.version);
} else {

  if (fs.existsSync(config_filename)) {
    try {
      console.log('Loading config from ' + config_filename);
      var config_file = require(config_filename);
      options = merge(options, config_file);
    }
    catch (e) {
      console.log('Error loading ' + config_filename, e);
    }
  } else {
    console.log(config_filename + ' not found. Using default config.');
  }

  if (argv._[0] === 'send') {
    var result_path = path.resolve(options.result_dir, options.result_filename);
    if(fs.existsSync(result_path)){
      require('./send.js')(options, fs.readFileSync(result_path));
    } else {
      console.log('Result file is not find. Compile the letter first.')
    }

  } else {
    var Postboy = require(path.resolve(__dirname, '..'));
    var instance = new Postboy(options, cwd, argv._);
    instance.compile();
  }
}
