define([
  'chaplin',
  'controllers/base/controller',
  'models/base/model',
  'models/newsletter',
  'models/stories',
  'models/Story',
  'views/newsletter-view',
  'views/newsletter-nav-view',
  'views/stories-view'
], function(Chaplin, Controller, Model, Newsletter, Stories, Story, NewsletterView, NewsletterNav, StoriesView){
  'use strict';

  var NewsletterController = Controller.extend({

    beforeAction : function(){
      Controller.prototype.beforeAction.apply(this, arguments);

      // Have we set up the wrapping view yet?
      this.view = new NewsletterView({
        model       : this.model,
        autoRender  : true,
        region      : 'main'
      });

      // Setup the navigation
      this.nav = new NewsletterNav({
        autoRender  : true,
        model       : this.model,
        region      : 'nav'
      });
    },


    initialize : function(params){
      Chaplin.Controller.prototype.initialize.apply(this, arguments);
      var self = this;

      // Subscribe to events from views
      this.subscribeEvent('story_index_update', this.updateStoryIndices);
      this.subscribeEvent('create_new_story', this.createNewStory);
      this.subscribeEvent('delete_story', this.deleteStory);

      // Setup the newsletter model
      this.model        = new Newsletter();
      this.model.url    = '/newsletter/' + params.id;
      this.model.params = {
        model           : 'newsletter',
        id              : params.id
      };

      // Set up the stories collection
      this.collection        = new Stories();
      this.collection.url    = '/story';
      this.collection.params = {
        newsletter_id : params.id
      };
      this.collection.listen();
      this.model.set('stories', this.collection);

      // Go fetch the publication templates and apply to the newsletter
      var publication = new Model();
      this.model.listen(function(results){
        publication.url = '/publication/' + results.publication_id
        publication.listen(function(){
          self.model.set('channels', publication.get('channels'));
          self.nav.select(params.templateIndex);
        });
      });

      // Listen for channel updates, update the newsletter
      this.listenTo(publication, 'change:channels', function(model){
        self.model.set('channels', model.get('channels'));
      });

      // Listen for newsletter model title changes and update the view
      this.listenTo(this.model, 'change:title', function(model){
        self.publishEvent('update_title', this.model);
      });
    },


    queryHandler : function(params){
      params.templateIndex == 'create' ? this.editor() : this.preview(params)
    },


    preview : function(params){
      //console.log(params)
    },


    editor : function(){
      var self = this;

      // Make a stories view
      var storiesView = new StoriesView({
        collection  : this.collection,
        autoRender  : true,
        region      : 'stories'
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

      var otherStory = this.collection.findWhere({ 'sort_index' : newIndex });

      story.save({ sort_index : newIndex });
      otherStory.save({ sort_index : oldIndex });
      this.collection.sort();
    }
  });

  return NewsletterController;
})