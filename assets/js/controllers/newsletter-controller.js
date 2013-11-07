define([
  'chaplin',
  'controllers/base/controller',
  'models/stories',
  'models/base/model',
  'views/newsletter-view'
], function(Chaplin, Controller, Collection, Model, NewsletterView){
  'use strict';

  var Newsletter = Controller.extend({

    showOne : function(params){
      // Set up stories collections listener
      var stories     = new Collection();
      stories.url     = '/story';
      stories.params  = {
        newsletter_id : params.id
      };
      stories.listen({ parentIdentifier : 'newsletter_id' });
      stories.comparator = function(story){
        return story.get('sort_index');
      };

      var model = new Model();
      model.url = '/newsletter/' + params.id;
      model.fetch();
      model.set('stories', stories);

      // Make a view
      var newsletter = new NewsletterView({
        model       : model,
        collection  : stories,
        autoRender  : true,
        region      : 'main'
      });

      // Listen for story index updates
      Chaplin.mediator.subscribe('storyIndexUpdate', function(story, direction){
        var oldIndex = story.get('sort_index');

        if(direction == 'up' && oldIndex == 0) return false
        if(direction == 'down' && oldIndex == stories.models.length - 1) return false

        var newIndex    = (direction == 'up') ? oldIndex - 1 : oldIndex + 1;
        var otherStory  = stories.findWhere({ 'sort_index' : newIndex});

        story.save({ sort_index : newIndex });
        otherStory.save({ sort_index : oldIndex });
        stories.sort();
      });

      // Listen for story deletes, and then reindex
      Chaplin.mediator.subscribe('storyDelete', function(){
        for(var i=0; i<stories.models.length; i++){
          stories.models[i].save({ sort_index : i });
        }
        stories.sort();
      });

      // Listen for changes and rerender
      newsletter.listenTo(stories, 'change', function(model){
        stories.sort();
        newsletter.renderAllItems();
      });
    }
  });

  return Newsletter;
})