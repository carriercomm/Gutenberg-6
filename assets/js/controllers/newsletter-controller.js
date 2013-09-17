define([
  'chaplin',
  'controllers/base/controller',
  'models/newsletter',
  'models/stories',
  'views/newsletter-view',
  'views/stories-view'
], function(Chaplin, Controller, Newsletter, Stories, NewsletterView, StoriesView){
  'use strict';

  var NewsletterController = Controller.extend({

    show : function(params){

      // Setup the newsletter model
      var newsletter = new Newsletter();
      newsletter.url = '/newsletter/' + params.id;
      newsletter.listen();
      newsletter.set('stories', stories);

      // Make the newsletter view
      var newsletterView = new NewsletterView({
        model       : newsletter,
        autoRender  : true,
        region      : 'main'
      });

      // Listen for newsletter model changes and update the view
      this.listenTo(newsletter, 'change:title', function(model){
        var $el = $(newsletterView.el).find('#story-title');
        if(!$el.hasClass('preventUpdate')){
          $el.val(newsletter.get('title'));
        }
      });

      // Set up the stories collection
      var stories     = new Stories();
      stories.url     = '/story';
      stories.params  = {
        newsletter_id : params.id
      };
      stories.listen();
      stories.comparator = function(story){
        return story.get('sort_index');
      };

      // Make the newsletter view
      var storiesView = new StoriesView({
        collection  : stories,
        autoRender  : true,
        region      : 'stories'
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
      newsletterView.listenTo(stories, 'change:sort_index', function(model){
        stories.sort();
        storiesView.renderAllItems();
      });
    }
  });

  return NewsletterController;
})