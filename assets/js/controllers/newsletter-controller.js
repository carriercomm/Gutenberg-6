define([
  'controllers/base/controller',
  'models/base/collection',
  'models/base/model',
  'views/newsletter-view'
], function(Controller, Collection, Model, NewsletterView){
  'use strict';

  var Newsletter = Controller.extend({

    showOne : function(params){
      this.model      = new Model();
      this.model.url  = '/newsletter/' + params.id;
      this.model.fetch();

      // Set up stories collections listener
      var stories     = new Collection();
      stories.url     = '/story';
      stories.params  = {
        newsletter_id : params.id
      };
      stories.listen();

      // Make a view
      var newsletter = new NewsletterView({
        collection  : stories,
        autoRender  : true,
        region      : 'main'
      });
    }
  });

  return Newsletter;
})