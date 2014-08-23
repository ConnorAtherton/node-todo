#!/usr/bin/env node

var chalk = require('chalk');
var createTodos = require('../src/todo.js');

createTodos(null, function(err) {
  if (err) console.log(chalk.red(err));

  console.log(chalk.yellow('Your todos are in todo.md'));
});

// provide clean output on exceptions rather than dumping a stack trace
process.on('uncaughtException', function(err){
  console.log(chalk.red(err));
  process.exit(1);
});
