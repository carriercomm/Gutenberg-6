define([
  'models/base/collection',
  'models/story'
], function(Collection, Story){
  'use strict';

  var collection = Collection.extend({
    model : Story
  });


  collection.prototype.comparator = function(model){
    return model.get('sort_index');
  };


  // Returns an array (not collection) of stories with an
  // array (not collection) of images. Intended use is for
  // templating
  collection.prototype.prepForTemplateUsage = function(channelTitle){

    var sortBy  = 'sort_channel_' + channelTitle + '_index';
    var stories = [];

    this.each(function(model){
      // The shroud of the dark side has fallen. Begun the Clone War has.
      var clone     = _.clone(model.attributes);

      // Deal with the images better for templating
      var images = [];
      model.get('images').each(function(img){
        var url   = img.get('url');
        var crops = img.get('crops');

        if(crops){
          var image = _.findWhere(crops, { title : channelTitle });
          if(image) url = image.url
        }

        images.push(url);
      });

      // Deal with videos better for templating
      var videos = [];
      model.get('videos').each(function(vid){
        videos.push({
          poster  : vid.get('image_url'),
          url     : vid.get('url')
        });
      });

      // Make a standard index property available for the templates
      var sortIndex     = clone[sortBy];
      clone.sort_index  = sortIndex;
      clone.images      = images;
      clone.videos      = videos;

      stories.push(clone);
    });

    stories = _.sortBy(stories, function(item){
      return item[sortBy]
    });

    return stories
  };

  return collection;
});