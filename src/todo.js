// TODO Throw an error message when no .gitignore is present
var path = require("path");
var fs = require("fs");
var split = require("split");
var chalk = require('chalk');

var ignoreList = fs.readFileSync('.gitignore').toString().split('\n');
var output = fs.createWriteStream('todo.md');
var outputStarted = false;
var commentSyntax = /\s*(\/\/|\/\*|\*|#)\s(TODO|FIXME).*/i;
var commentMatch = /\s*(\/\/|\/\*|\*|#)\s(TODO|FIXME)/i;
var filesWritten = [];

/* Walks all child directories looking for files to scan starting from
 * a root directory.
 *
 * @param {dir} string - Root dir to start the search from.
 * @param {function} cb - Function to be called once traversing
 *                        is finished.
 */
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

  /*
   * This deals with the case where we read
   * an empty dir last.
   */
  if (!remaining) cb();

}


/* Scans a file for todos and writes any lines to todos.md.
 *
 * @param {file} string - File to scan for todos
 * @param {header} string - A message written as a header
 *                          for each file in todo.md
 */
function scan(file, header) {
  fs.createReadStream(file)
    .pipe(split())
    .on('data', function(line) {
      line = line.toString();

      if (commentSyntax.test(line)) {
        if (!outputStarted) {
          output.write('#TODOS\n');
          outputStarted = true;
        }

        if (contains(filesWritten, header)) {
          header = null
        } else {
          filesWritten.push(header);
        }

        output.write(format(line.replace(commentMatch, ''), header));
      };
    });
}

/* Constructs a string to be placed into todos.md.
 * If it is the first todo occurence we prepend a header containing the file name.
 *
 * @param {line} string - Current line *todo* was located on
 * @param {header} string|undefined - The header string if it is the first todo
 *                                    occurence in the file, undefined otherwise.
 * @returns {string} The header to be displayed in todos.md
 */
function format(line, header) {
  var header = header ? '\n##' + header + '\n' : header;
  var line = '-' + line + '\n';
  return header ? header + line : line;
}

/* Returns true if a file should be scanned for todos. Currently no hidden files
 * or directories or files in .gitignore will be counted.
 *
 * @param {string} file
 * @returns {boolean}
 */
function shouldContinue(file) {
  return !contains(ignoreList, file) && !isHidden(file);
}

/* Checks if a primitive is contained within an array.
 *
 * @param {array} array
 * @param {el} string|number
 * @returns {boolean}
 */
function contains(array, el) {
  return array.indexOf(el) !== -1;
}

/* Checks to see if a file is hidden
 *
 * @param {file} string - Name of the file to check
 * @returns {boolean}
 */
function isHidden(file) {
  return file.substring(0, 1) === '.';
}

/* Map each value in the list to a single string
 *
 * e.g  node_modules/* -> node_modules
 *
 * @param {Array} list - The list containing globs to be formatted
 */

function formatIgnoreList(list) {
  return list.map(function(entry) {
    var splitIndex = entry.indexOf('/');

    var value = splitIndex !== -1 ? entry.slice(0, splitIndex) : entry;
    return value.trim();
  });
}

/* This is the main entrypoint, it collects and correctly formats
 * the ignore globs and starts the traversal down starting from the
 * current directory.
 *
 * @param {Object} argv - all command line arguments passed in.
 */
function init(argv) {
  // append to ignore list for the ignore flag
  ignores = argv.ignore ? argv.ignore.split(',') : undefined;
  if (ignores) ignoreList = ignoreList.concat(ignores);

  ignoreList = formatIgnoreList(ignoreList);

  walk(null, function(err) {
    if (err) console.log(chalk.red(err));
    console.log(chalk.yellow('\n  Your todos are in todo.md\n'));
  });
}

module.exports = init;

