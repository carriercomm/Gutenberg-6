define([
  'chaplin',
  'controllers/base/controller',
  'models/base/collection',
  'models/base/model',
  'models/newsletter',
  'views/publications-view',
  'views/publication-view',
  'views/newsletters-view'
], function(Chaplin, Controller, Collection, Model, Newsletter, PublicationsView, PublicationView, NewslettersView){
  'use strict';

  var months  = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ];

  var publicationController = Controller.extend({

    initialize : function(){
      Chaplin.Controller.prototype.initialize.apply(this, arguments);
      this.subscribeEvent('create_newsletter', this.createNewsletter);
    },


    list : function(params){
      var publications = new Collection();
      publications.url = '/publication';
      publications.listen();

      this.view = new PublicationsView({
        collection  : publications,
        region      : 'main'
      });

      // Bind the view to the updates
      var view = this.view;
      this.view.listenTo(publications, 'change', function(model){
        view.renderItem(model);
      });
    },


    show : function(params){
      var self = this;

      // Fetch model and setup listener
      this.model        = new Model();
      this.model.url    = '/publication/' + params.id;
      this.model.params = {
        model           : 'publication',
        id              : params.id
      }
      this.model.listen(function(){
        self.publishEvent('crumbUpdate', [
          {
            route : '/',
            title : 'Publications'
          },
          {
            route : '/publication/' + self.model.get('publication_id'),
            title : self.model.get('title')
          }
        ]);
      });

      // Set up published collections listener
      var published     = new Collection();
      published.url     = '/newsletter';
      published.params  = {
        publication_id  : params.id,
        published       : true
      };
      published.listen();

      // Set up unpublished collection listener
      var unpublished     = new Collection();
      unpublished.url     = '/newsletter';
      unpublished.params  = {
        publication_id  : params.id,
        published       : false
      };
      unpublished.listen();

      // Create The wrapper View
      this.view = new PublicationView({
        autoRender  : true,
        region      : 'main',
        model       : this.model
      });

      // Create the subviews
      var publishedView = new NewslettersView({
        region      : 'published',
        collection  : published,
        title       : 'Published Newsletters'
      });
      var unpublishedView = new NewslettersView({
        region      : 'unpublished',
        collection  : unpublished,
        title       : 'Unpublished Newsletters'
      });
    },


    createNewsletter : function(publication){
      var date          = new Date();
      var defaultTitle  = publication.get('title') + ' - ' + months[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear();
      var newsletter    = new Newsletter();
      newsletter.url    = '/newsletter/create';

      var attrs         = {
        publication_id  : publication.get('id'),
        title           : defaultTitle,
        published       : false
      };

      newsletter.save(attrs);
    }

  });

  return publicationController;
})