define([
  'controllers/base/controller',
  'models/base/collection',
  'models/base/model',
  'views/publications-view',
  'views/publication-view',
  'views/newsletters-view'
], function(Controller, Collection, Model, PublicationsView, PublicationView, NewslettersView){
  'use strict';

  var publicationController = Controller.extend({
    showAll : function(params){
      this.collection     = new Collection();
      this.collection.url = '/publication';
      this.collection.listen({});

      this.view = new PublicationsView({
        collection  : this.collection,
        region      : 'main'
      });

      // Bind the view to the updates
      var view = this.view;
      this.view.listenTo(this.collection, 'change', function(model){
        view.renderItem(model);
      });
    },

    showOne : function(params){
      this.model      = new Model();
      this.model.url  = '/publication/' + params.id;
      this.model.fetch();

      // Set up published collections listener
      var published     = new Collection();
      published.url     = '/newsletter';
      published.params  = {
        publication_id  : params.id,
        published       : true
      };
      published.listen({ parentIdentifier : 'publication_id' });

      // Set up unpublished collection listener
      var unpublished     = new Collection();
      unpublished.url     = '/newsletter';
      unpublished.params  = {
        publication_id  : params.id,
        published       : false
      };
      unpublished.listen({ parentIdentifier : 'publication_id' });


      // Create Views
      var wrapperView = new PublicationView({
        autoRender  : true,
        region      : 'main',
        model       : this.model
      });

      var publishedView = new NewslettersView({
        region      : 'published',
        collection  : published
      });
      publishedView.setTitle('Published Newsletters');

      var unpublishedView = new NewslettersView({
        region      : 'unpublished',
        collection  : unpublished
      });
      unpublishedView.setTitle('Unpublished Newsletters');

    }
  });

  return publicationController;
})