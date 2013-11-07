/**
 * ImageController
 *
 * @module		:: Controller
 * @description	:: Contains logic for handling requests.
 */

var magik = require('gm');
var fs    = require('fs');
var path  = require('path');

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
  },


  serve : function(req, res){
    var baseDir = 'uploads';
    if(process.env.STACKATO_FILESYSTEM) baseDir = process.env.STACKATO_FILESYSTEM

    var filePath = path.join(process.cwd(), baseDir, req.params[0]);

    fs.readFile(filePath, function(err, img){
      res.end(img, 'binary');
    });
  }
};


var saveImage = function(file, story_id, next){

  // Set a base directory, use stackato's special instance if in production
  var baseDir = 'uploads';
  if(process.env.STACKATO_FILESYSTEM) baseDir = process.env.STACKATO_FILESYSTEM

  var tempPath  = file.path || file.qqfile.path;
  var uploadDir = path.join(baseDir, story_id);
  var newPath   = path.join(uploadDir, file.name);

  // Create a directory for the image to live
  fs.mkdir(uploadDir, function(error){
    if(error) console.log(error);

    // Use graphicsmagik to write the file
    magik(tempPath).identify(function(err, properties){

      if(err) console.error(err);
      else {
        // If the image is greater than 800px wide...
        var newWidth = properties.size.width;
        if(properties.size.width > 800) newWidth = 800

        // Resize the image
        magik(tempPath).resize(newWidth).write(newPath, function(err){
          if(err) console.log(err);

          // Create the new image model
          var image = Image.create({
            path      : newPath,
            url       : path.join('/upload', newPath.replace(baseDir, '')),
            story_id  : story_id
          }).done(function(err, img){

            // This is lame, but it doesn't look like graphicmagick's
            // callbacks are actually waiting until the file writing
            // is done. So just timeout I guess...
            setTimeout(function(){
              next(img || {});

              Image.publishCreate({
                url       : path.join('/upload', newPath.replace(baseDir, '')),
                story_id  : story_id,
                id        : img.id
              });
            }, 2000);

          });
        });
      }
    });
  });
};