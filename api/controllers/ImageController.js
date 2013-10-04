/**
 * ImageController
 *
 * @module		:: Controller
 * @description	:: Contains logic for handling requests.
 */

var path = require('path');
var fs = require('fs');

module.exports = {

  upload : function(req, res){

    // Ensure we're working with an array
    var files    = req.files.images || req.files.qqfile;
    var story_id = req.query.story_id;
    if(!files.length) files = [files]

    // Loop over passed in uploaded images to resize,
    // write to disk, and create a new model
    var imagesSaved = 0;
    for(var i=0; i<files.length; i++){

      // Constrain to 800 pixels wide
      ImageService.crop(files[i].path || files[i].qqfile.path, {
        w : 800
      }, function(filePath){

        // Write the file to either a remote service if available
        ImageService.write(filePath, function(url){

          // Create the new image model
          var image = Image.create({
            url       : url,
            story_id  : story_id
          }).done(function(err, img){

            // Publish to socket
            Image.publishCreate({
              url       : url,
              story_id  : story_id,
              id        : img.id
            });
          });

          // When all images are saved, respond
          imagesSaved++;
          if(imagesSaved == files.length){
            res.send({ success : true });
          }
        });

      });
    }
  },


  // Designed to serve images for local development
  serve : function(req, res){
    var filePath = path.join(process.cwd(), '/uploads', req.params[0]);

    fs.readFile(filePath, function(err, img){
      if(err) console.log(err);
      res.end(img, 'binary');
    });
  }
};