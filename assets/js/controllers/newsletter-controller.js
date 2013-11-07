define([
  'chaplin',
  'controllers/base/controller',
  'models/base/model',
  'models/newsletter',
  'models/stories',
  'models/story',
  'views/base/collection-view',
  'views/newsletter-editor-view',
  'views/newsletter-pre-view',
  'views/newsletter-nav-view',
  'views/stories-pre-view',
  'views/story-editor-view'
], function(Chaplin, Controller, Model, Newsletter, Stories, Story, CollectionView, 
  NewsletterEditorView, NewsletterPreView, NewsletterNav, StoriesPreView, StoryEditorView){
  'use strict';

  var NewsletterController = Controller.extend({

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

      // Set up a publication model for easy reference
      // to configuration options
      var publication = new Model();

      // Fetch the newsletter and then the publication
      this.model.listen(function(results){
        publication.url = '/publication/' + results.publication_id
        publication.listen();
      });

      // Set up the stories collection
      this.collection        = new Stories();
      this.collection.url    = '/story';
      this.collection.params = {
        newsletter_id : params.id
      };
      this.collection.listen();
      this.model.set('stories', this.collection);

      // Listen for publication channel updates
      this.listenTo(publication, 'change:channels', function(model){

        // Setup the channel model in the newsletter
        var channels = publication.get('channels');
        var index    = params.templateIndex;
        if(index && index != 'create') channels[index].active = true
        self.model.set('channels', model.get('channels'));
        self.collection.channels = model.get('channels');

        // Notify everyone that the channels are now registered and 
        // config options are available for use
        self.publishEvent('channels_registered', model.get('channels'));
      });

      // Listen for newsletter model title changes and update the view
      this.listenTo(this.model, 'change:title', function(model){
        self.publishEvent('update_title', this.model);
      });
    },


    // Decide if we should render a preview or the editor view
    queryHandler : function(params){
      if(typeof(params.templateIndex) == 'undefined') params.templateIndex = 'create'
      params.templateIndex == 'create' ? this.editor() : this.previewContainer(params)
    },


    // Used to display only the preview mode with no frills attached. Commonly called 
    // by the iFrame within the previewContainer
    preview : function(params){
      var storiesView = new StoriesPreView({
        model         : this.model,
        collection    : this.collection,
        autoRender    : false,
        params        : params
      });

      // Kill all of the application stylesheets and render
      $('link[rel="stylesheet"]').attr('disabled', 'disabled');
      $('body').html(storiesView.render().el)
    },


    // Makes a view, builds an iFrame, and the iFrame then calls the preview method above
    previewContainer : function(params){

      // This method seems to fire before window.location properties
      // are fully updates, hence the complicated solution below
      var query     = $.param(params);
      var href      = window.location.href;
      var search    = window.location.search;
      var iframeURL = href.replace('/newsletter/', '/preview/').replace(search, '') + '?' + query;

      this.view = new NewsletterPreView({
        model       : this.model,
        autoRender  : true,
        region      : 'main',
        iframeURL   : iframeURL
      });

      this.nav = new NewsletterNav({
        autoRender  : true,
        model       : this.model,
        region      : 'nav'
      });
    },


    // The standard editor view
    editor : function(){
      var self = this;

      this.view = new NewsletterEditorView({
        model       : this.model,
        autoRender  : true,
        region      : 'main'
      });

      this.nav = new NewsletterNav({
        autoRender  : true,
        model       : this.model,
        region      : 'nav'
      });

      var storiesView = new CollectionView({
        collection    : this.collection,
        autoRender    : true,
        region        : 'stories',
        itemView      : StoryEditorView,
        template      : '<div id="stories-wrapper"></div>',
        listSelector  : '#stories-wrapper'
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