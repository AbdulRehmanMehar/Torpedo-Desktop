/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const copydir = require('copy-dir');
 
copydir.sync('./src/frontend/build', './dist/build', {
  filter: function(stat, filepath, filename){
    // do not want copy .html files
    // if(stat === 'file' && path.extname(filepath) === '.html') {
    //   return false;
    // }
    // // do not want copy .svn directories
    // if (stat === 'directory' && filename === '.svn') {
    //   return false;
    // }
    // do not want copy symbolicLink directories
    if (stat === 'symbolicLink') {
      return false;
    }
    return true;  // remind to return a true value when file check passed.
  }
});