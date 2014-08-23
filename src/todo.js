// TODO Write full docs for this file
var path = require("path");
var fs = require("fs");
var split = require("split");

var ignoreList = fs.readFileSync('.gitignore').toString().split('\n');
var filesWritten = [];
// TODO Put regexs at the top into a variable for when they become complex
var output = fs.createWriteStream('todo.md');
var outputStarted = false;

//
//
//
//
function walk(dir, cb) {
  var remaining = 1;
  var rootDir = process.cwd() + (dir || '');

  (function traverse(dir) {
    fs.readdir(dir, function(err, list) {
      if (err) return cb(err);
      remaining--;

      list.forEach(function(file) {
        remaining++;

        var absPath = path.resolve(dir, file);
        var header = path.relative(rootDir, absPath);

        fs.stat(absPath, function(err, stat) {
          if (err) return cb(err);

          if (stat) {
            if (stat.isDirectory()) {
              return shouldContinue(file) ? traverse(absPath) : --remaining;
            } else {
              if (shouldContinue(file)) scan(absPath, header);
              --remaining;
              if (!remaining) return cb();
            }
          }
        });
      });
    });
  })(rootDir)

  //
  // This deals with the case where we read
  // an empty dir last
  //
  if (!remaining) cb();

}

//
//
//
function scan(file, header) {
  fs.createReadStream(file)
    .pipe(split())
    .on('data', function(line) {
      line = line.toString();
      if (/\s*\/\/\s*TODO.*/.test(line)) {
        if (!outputStarted) {
          output.write('#TODOS\n');
          outputStarted = true;
        }

        if (contains(filesWritten, header)) {
          header = null
        } else {
          filesWritten.push(header);
        }
        // TODO Should this be hardcoded?
        output.write(format(line.replace(/\s*\/\/\s*TODO/, ''), header));
      };
    });
}

//
//
//
function format(line, header) {
  var header = header ? '\n##' + header + '\n' : header;
  var line = '-' + line + '\n';
  return header ? header + line : line;
}

//
//
//
function shouldContinue(file) {
  return !contains(ignoreList, file) && !isHidden(file);
}

//
//
//
function contains(array, el) {
  return array.indexOf(el) !== -1;
}

//
//
//TODO this is a todo
function isHidden(file) {
  return file.substring(0, 1) === '.';
}

module.exports = walk;

