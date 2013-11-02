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
      this.subscribeEvent('story_index_swap', this.storyIndexSwap);
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
        publication.listen(function(){
          self.publishEvent('crumbUpdate', [
            {
              route : '/',
              title : 'Publications'
            },
            {
              route : '/publication/' + publication.get('id'),
              title : publication.get('title')
            },
            {
              route : '/newsletter/' + self.model.get('id'),
              title : self.model.get('title')
            }
          ]);
        });
      });

      // Set up the stories collection
      this.collection        = new Stories();
      this.collection.url    = '/story';
      this.collection.params = {
        newsletter_id : params.id
      };
      this.collection.listen(function(){
        self.publishEvent('collection_registered');
      });

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
      var self = this;

      // Wait for both the collection and channels to finish registering
      // then index the channel stoires
      var eventCount = 0;
      this.subscribeEvent('collection_registered', function(){
        eventCount += 1;
        if(eventCount == 2) self.updateStoryChannelIndices();
      });
      this.subscribeEvent('channels_registered', function(){
        eventCount += 1;
        if(eventCount == 2) self.updateStoryChannelIndices();
      });

      var storiesView = new StoriesPreView({
        model         : this.model,
        collection    : this.collection,
        autoRender    : false,
        params        : params
      });

      // Kill all of the application stylesheets and render
      $('link[rel="stylesheet"]').attr('disabled', 'disabled');
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
        autoRender  : true,
        region      : 'main',
        iframeURL   : iframeURL,
        params      : params,
        model       : this.model,
        collection  : this.collection
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

      // Create a new story model
      var story = new Story({
        newsletter_id : newsletter.get('id'),
      });
      story.url = '/story/create';

      // Set the sort_index of the new story
      var lastStory = this.collection.max(function(model){
        return model.get('sort_index')
      });
      var lastStoryIndex = 0;
      if(lastStory != -Infinity) lastStoryIndex = lastStory.get('sort_index') + 1;
      story.set('sort_index', lastStoryIndex);

      // Grab the channel config and use to create channel
      // specific sort indeces
      var channels = this.model.get('channels');
      for(var i=0; i<channels.length; i++){
        var attrTitle = 'sort_channel_' + channels[i].title + '_index';
        var lastChannelStory = this.collection.max(function(model){
          return model.get(attrTitle);
        });
        var lastChannelStoryIndex = 0;
        if(lastChannelStory != -Infinity) lastChannelStoryIndex = lastChannelStory.get(attrTitle) + 1;
        story.attributes[attrTitle] = lastChannelStoryIndex;
      }

      story.save();
    },


    deleteStory : function(story){
      story.destroy();
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
    },


    updateStoryChannelIndices : function(){
      var collection    = this.collection;
      var activeChannel = _.findWhere(collection.channels, { 'active' : true });
      var namespace     = 'sort_channel_' + activeChannel.title + '_index';

      // Create some util arrays to help me count which models are indexed
      // and which still need to be indexed
      var indexedModels = [];
      var nonIndexedModels = [];
      collection.each(function(model){
        if(model.get(namespace) == undefined) nonIndexedModels.push(model);
        else indexedModels.push(model);
      });

      // Get the highest value for the specified channel index
      var max = -1
      if(indexedModels.length) {
        var maxModel = _.max(indexedModels, function(model){
          return model.get(namespace);
        });
        max = maxModel.get(namespace);
      }

      // Index all the one's that need to be indexed
      for(var i=0; i<nonIndexedModels.length; i++){
        var attr = {}
        attr[namespace] = max+=1
        nonIndexedModels[i].set(attr);
        nonIndexedModels[i].save();
      };
    },


    storyIndexSwap : function(idA, idB, channelTitle){
      var namespace = 'story_index'
      if(channelTitle) namespace = 'sort_channel_' + channelTitle + '_index';

      var storyA = this.collection.findWhere({id : idA});
      var storyB = this.collection.findWhere({id : idB});
      var indexA = storyA.get(namespace);
      var indexB = storyB.get(namespace);

      storyA.attributes[namespace] = indexB;
      storyB.attributes[namespace] = indexA;

      storyA.save();
      storyB.save();
    }
  });

  return NewsletterController;
})