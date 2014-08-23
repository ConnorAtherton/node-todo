var fs = require("fs");
var path = require("path");
var ignoreList = fs.readFileSync('.gitignore').toString().split('\n');
console.log(ignoreList);

function walk(dir, cb) {
  var remaining = 1;

  (function traverse(dir) {
    fs.readdir(dir, function(err, list) {
      if (err) return cb(err);

      remaining--;
      list.forEach(function(file) {
        remaining++;

        var absPath = path.resolve(dir, file);
        fs.stat(absPath, function(err, stat) {
          if (err) return cb(err);

          if (stat) {
            if (stat.isDirectory()){
              return shouldContinue(file) ? traverse(absPath) : --remaining;
            } else {
              // if we should scan this file call
              if (shouldContinue(file)) scan(absPath);
              return --remaining;
            }
          }
        });
      });
    });

    if(!remaining) cb(null);

  })(process.cwd() + (dir || ''));
}

walk(null, function(err) {
  if (err) console.log(err);

  console.log('Finished Scanning');
})

//
//
//
function scan(file) {
  console.log('scanning the file', file);
}

//
//
//
function shouldContinue(dir) {
  return shouldIgnore(dir) && !isHidden(dir);
}

//
//
//
function isHidden(dir) {
  return dir.substring(0, 1) === '.';
}

//
//
//
function shouldIgnore(dir) {
  console.log('ahoudl we ginore', dir);
  return ignoreList.indexOf(dir) === -1;
}
