/**
 * ImageController
 *
 * @module		:: Controller
 * @description	:: Contains logic for handling requests.
 */

var magik = require('imagemagick');
var fs    = require('fs');

module.exports = {

  upload : function(req, res){

    // Ensure we're working with an array
    var files = req.files.images || req.files.qqfile;
    var story_id = req.query.story_id;
    if(!files.length) files = [files]

    // Loop over passed in images to resize,
    // write to disk, and create a new model
    var imagesSaved = [];
    for(var i=0; i<files.length; i++){
      saveImage(files[i], story_id, function(image){
        imagesSaved.push(image);
        if(imagesSaved.length == files.length){
          res.send({ success : true });
        }
      });
    }
  }
};


var saveImage = function(file, story_id, next){

  var tempPath  = file.path || file.qqfile.path;
  var basePath  = 'assets/uploads/' + story_id;
  var newPath   = basePath + '/' + file.name;

  // Create a directory for the image to live
  fs.mkdir(basePath, function(error){
    if(error) console.log(error);

    // Use imagemagik to write the file
    magik.identify(tempPath, function(err, properties){
      if(err) console.error(err);
      else {

        // If the image is greater than 800px wide...
        var newWidth = properties.width;
        if(properties.width > 800) newWidth = 800

        // Resize the image
        magik.resize({
          srcPath : tempPath,
          dstPath : newPath,
          width   : newWidth
        }, function(err){
          if(err) console.error(err);

          // Create the new image model
          var image = Image.create({
            url : newPath.replace('assets', ''),
            story_id : story_id
          }).done(function(err, img){
            next(img || {});
          });

        });
      }
    });
  });
}