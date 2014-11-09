#!/usr/bin/env node

var argv = require('minimist')(process.argv.slice(2));
var createTodos = require('../src/todo.js');

createTodos(argv);

// provide clean output on exceptions rather than dumping a stack trace
process.on('uncaughtException', function(err){
  console.log('Error: ', chalk.red(err));
  process.exit(1);
});
