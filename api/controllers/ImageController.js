/**
 * ImageController
 *
 * @module		:: Controller
 * @description	:: Contains logic for handling requests.
 */

var path  = require('path');
var fs    = require('fs');

module.exports = {

  // This method is copied almost exactly from the original sails blueprint method.
  // The only difference is that I slightly modify the json output to support more
  // detailed information
  find : function(req, res, next){

    if(req.params.id){
      Image.findOne(req.params.id).done(function(err, model) {
        if(err) next(err);

        // Respond
        if(model){
          Image.subscribe(req.socket, model);
          res.json(model.toJSON());
        } else next();
      });
    } else{
      var where = req.param('where');
      var util  = sails.util;
      var params;

      if (!where) {
        params = util.extend(req.query || {}, req.params || {}, req.body || {});
        params = sails.util.objReject(params, function (param, key) {
          return util.isUndefined(param) ||
            key === 'limit' || key === 'skip' || key === 'sort';
        });

        var options = {
          limit: req.param('limit') || undefined,
          skip: req.param('skip') || req.param('offset') || undefined,
          sort: req.param('sort') || req.param('order') || undefined,
          where: where || undefined
        };
      }

      Image.find(options).done(function(err, models){

        if(err) return next(err);
        if(!models) return next();

        if (sails.config.hooks.pubsub && !Image.silent) {
          Image.subscribe(req.socket);
          Image.subscribe(req.socket, models);
        }

        var response = {
          results   : [],
          channels  : []
        }

        // If a story id is passed in, we know that each image shares a single publication
        // Below attaches the crop options to the json response
        if(params.story_id){
          models.forEach(function(model, index){
            response.results.push(model.toJSON());
          });

          // Do this thing
          Story.findOne(params.story_id).done(function(err, story) {
            Newsletter.findOne(story.newsletter_id).done(function(err, newsletter){
              Publication.findOne(newsletter.publication_id).done(function(err, publication){
                publication.channels.forEach(function(channel){
                  response.channels.push({
                    title : channel.title,
                    crop  : channel.crop
                  });
                });

                return res.json(response);
              });
            });
          });
        } else{
          // Respond normally
          models.forEach(function(model, index){
            response.results.push(model.toJSON());
          });
          return res.json(response);
        }
      });
    }
  },


  getCropConfig : function(id, next){
    var settings = {};
    next();
  },


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