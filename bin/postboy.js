#!/usr/bin/env node

var Postboy = require('../lib');
var options = require('../postboy.js');

var test = new Postboy(options.options, options.variables);

test.compile('index.html');
process.exit();