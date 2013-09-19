define([
  'chaplin',
  'controllers/base/controller',
  'models/newsletter',
  'models/stories',
  'models/Story',
  'views/newsletter-view',
  'views/stories-view'
], function(Chaplin, Controller, Newsletter, Stories, Story, NewsletterView, StoriesView){
  'use strict';

  var NewsletterController = Controller.extend({

    initialize : function(){
      Chaplin.Controller.prototype.initialize.apply(this, arguments);
      this.subscribeEvent('story_index_update', this.updateStoryIndices);
      this.subscribeEvent('create_new_story', this.createNewStory);
      this.subscribeEvent('delete_story', this.deleteStory);
    },

    show : function(params){

      var self = this;

      // Set up the stories collection
      this.collection        = new Stories();
      this.collection.url    = '/story';
      this.collection.params = {
        newsletter_id : params.id
      };
      this.collection.listen();

      // Setup the newsletter model
      this.model        = new Newsletter();
      this.model.url    = '/newsletter/' + params.id;
      this.model.params = {
        model           : 'newsletter',
        id              : params.id
      };
      this.model.listen();
      this.model.set('stories', this.collection);

      // Make the newsletter view
      this.view = new NewsletterView({
        model       : this.model,
        autoRender  : true,
        region      : 'main'
      });

      // Make the newsletter view
      var storiesView = new StoriesView({
        collection  : this.collection,
        autoRender  : true,
        region      : 'stories'
      });


      //TODO: can i  move these out of here into the initter
      // Listen for newsletter model changes and update the view
      var view = this.view;
      this.listenTo(this.model, 'change:title', function(model){
        var $el = $(view.el).find('#story-title');
        if(!$el.hasClass('preventUpdate')){
          $el.val(model.get('title'));
        }
      });

      // Listen for changes and rerender
      this.view.listenTo(this.collection, 'change:sort_index', function(model){
        self.collection.sort();
        storiesView.renderAllItems();
      });
    },


    createNewStory : function(newsletter){
      var stories       = newsletter.get('stories');
      var lastStory     = stories.min(function(model){
        return model.get('sort_index')
      });
      var story         = new Story({
        newsletter_id   : newsletter.get('id'),
        sort_index      : this.collection.models.length
      });
      story.url         = '/story/create';
      story.save();
    },


    deleteStory : function(story){
      story.destroy();
      for(var i=0; i<this.collection.models.length; i++){
        this.collection.models[i].save({ sort_index : i });
      }
      this.collection.sort();
    },


    updateStoryIndices : function(story, direction){
      var oldIndex = story.get('sort_index');
      var newIndex = 0;

      if(direction == 'up' && oldIndex == 0) {
        newIndex = this.collection.models.length - 1;
      } else if(direction == 'down' && oldIndex == this.collection.models.length - 1){
        newIndex = 0
      } else {
        newIndex = (direction == 'up') ? oldIndex - 1 : oldIndex + 1;
      }

      var otherStory = this.collection.findWhere({ 'sort_index' : newIndex});

      story.save({ sort_index : newIndex });
      otherStory.save({ sort_index : oldIndex });
      this.collection.sort();
    }
  });

  return NewsletterController;
})