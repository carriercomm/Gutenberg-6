/**
 * ImageController
 *
 * @module		:: Controller
 * @description	:: Contains logic for handling requests.
 */

var fs = require('fs');

module.exports = {

  upload : function(req, res){

    // Ensure we're working with an array
    var files = req.files.images;
    if(!files.length) files = [files]

    var filesWritten = 0;
    for(var i=0; i<files.length; i++){
      var tempPath  = files[i].path;
      var newPath   = process.cwd() + '/uploads/' + files[i].name;
      writeFile(tempPath, newPath, function(){
        filesWritten++
        if(filesWritten == files.length){
          res.send({ 'kewl' : true })
        }
      });
    }
  }
};


var writeFile = function(tempPath, newPath, next){
  fs.readFile(tempPath, function(err, data){
    fs.writeFile(newPath, data, function(err){
      next();
    });
  });
}