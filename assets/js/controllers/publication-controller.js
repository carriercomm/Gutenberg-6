define([
  'chaplin',
  'controllers/base/controller',
  'models/base/collection',
  'models/publications',
  'models/publication',
  'models/newsletter',
  'views/publications-view',
  'views/publication-view',
  'views/newsletters-view',
  'views/users-view'
], function(Chaplin, Controller, Collection, Publications, Publication, Newsletter, PublicationsView, PublicationView, NewslettersView, UsersView){
  'use strict';

  var months  = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ];

  var publicationController = Controller.extend({

    initialize : function(){
      Chaplin.Controller.prototype.initialize.apply(this, arguments);
      this.subscribeEvent('create_newsletter', this.createNewsletter);
    },


    list : function(params){

      this.publishEvent('crumbUpdate', []);

      var publications = new Publications();
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
      this.model        = new Publication();
      this.model.url    = '/publication/' + params.id;
      this.model.params = {
        model           : 'publication',
        id              : params.id
      }
      this.model.listen(function(){
        var allUserIds = _.union(self.model.get('editors'), self.model.get('owners'))
        var users = new Collection(self.model.get);

        // update the crumb
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

      // Create the wrapper view
      this.view = new PublicationView({
        autoRender  : true,
        region      : 'main',
        model       : this.model
      });

      // Set up newsletter collection listener
      var newsletters     = new Collection();
      newsletters.url     = '/newsletter';
      newsletters.params  = {
        publication_id : params.id
      };
      newsletters.listen();

      // Set up the users collection
      var users           = new Collection();
      users.url           = '/user';
      users.listen();

      // Create the subviews
      var newslettersView = new NewslettersView({
        region      : 'newsletters',
        collection  : newsletters,
        publication : this.model
      });
      var usersView = new UsersView({
        region      : 'users',
        collection  : users,
        publication : this.model
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