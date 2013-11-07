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
    var story_id = req.body.story_id;
    if(!files.length) files = [files]

    var imagesWritten = [];
    for(var i=0; i<files.length; i++){
      writeFile(files[i], story_id, function(image){
        imagesWritten.push(image);
        if(imagesWritten.length == files.length){
          res.send({ 'images' : imagesWritten });
        }
      });
    }
  }
};


var writeFile = function(file, story_id, next){

  var tempPath  = file.path;
  var newPath   = process.cwd() + '/uploads/' + file.name;

  fs.readFile(tempPath, function(err, data){
    fs.writeFile(newPath, data, function(err){
      var image = Image.create({
        url : newPath,
        story_id : story_id
      }).done(function(err, img){
        if(err) {
          console.log(err);
          next({});
        } else next(img);
      });
    });
  });
}