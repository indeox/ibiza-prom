var Rsync = require('rsync');

// Build the command
var rsync = new Rsync()
  .shell('ssh')
  .flags('azhP')
  .source(__dirname + '/../build/')
  .destination('deepcobalt@deepcobalt.com:/home/deepcobalt/ibizaprom.deepcobalt.com/');

// Execute the command
rsync.execute(function(error, code, cmd) {
  // we're done
  // console.log('done', code, cmd);
}, function(progressData) {
  console.log(progressData.toString())
}, function(errorData) {
    // do things like parse error output
});
