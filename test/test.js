var fs = require('fs');
var exec = require('child_process').exec;

describe('Node-todo tests', function() {
  var expectedOutput = fs.readFileSync('./todoExpected.md');
  var output;

  before(function() {
    var command = exec('cd fixtures && todos');
  });

  it('Should output the correct file', function() {
    output = fs.readFileSync('./fixture/todo.md');
    return output.toString() === expectedOutput.toString();
  });
});

