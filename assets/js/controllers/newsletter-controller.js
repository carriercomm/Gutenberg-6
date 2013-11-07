define([
  'controllers/base/controller',
  'models/stories',
  'models/base/model',
  'views/newsletter-view'
], function(Controller, Collection, Model, NewsletterView){
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
    }
  });

  return Newsletter;
})