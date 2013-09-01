/**
 * ImageController
 *
 * @module		:: Controller
 * @description	:: Contains logic for handling requests.
 */

var magik = require('imagemagick');

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
  var newPath   = 'assets/uploads/' + file.name;

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
          url : newPath,
          story_id : story_id
        }).done(function(err, img){
          next(img || {});
        });

      });
    }
  });
}