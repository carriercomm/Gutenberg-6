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
  collection.prototype.getSortedStoriesWithImages = function(sortBy){

    var stories = [];

    this.each(function(model){
      // The shroud of the dark side has fallen. Begun the Clone War has.
      var clone     = _.clone(model.attributes);

      // Deal with the images better for templating
      var images    = model.get('images');
      var imageURLS = [];

      if(images instanceof Backbone.Collection){
        if(images){
          images.each(function(model){
            imageURLS.push(model.get('url'));
          });
        }
      } else{
        imageURLS = images;
      }

      // Make a standard index property available for the templates
      var sortIndex     = clone[sortBy];
      clone.sort_index  = sortIndex;
      clone.images      = imageURLS;

      stories.push(clone);
    });

    stories = _.sortBy(stories, function(item){
      return item[sortBy]
    });

    return stories
  };

  return collection;
});