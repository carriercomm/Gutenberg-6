define([
  'chaplin',
  'views/base/view',
  'models/newsletter',
  'text!templates/publication.hbs'
], function(Chaplin, View, Newsletter, template){
  'use strict';

  var days    = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var months  = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ];

  var view = View.extend({
    template  : template,
    regions   : {
      'published'     : '#published-newsletters',
      'unpublished'   : '#unpublished-newsletters'
    },
    events    : {
      'click #add-newsletter' : 'createNewsletter'
    }
  });


  view.prototype.createNewsletter = function(e){
    e.preventDefault();

    var date          = new Date();
    var defaultTitle  = this.model.get('title') + ' - ' + months[date.getMonth()] + ' ' + days[date.getDay()] + ' ' + date.getFullYear();
    var newsletter    = new Newsletter();
    newsletter.url    = '/newsletter/create';
    var attrs         = {
      publication_id  : this.model.get('id'),
      title           : defaultTitle,
      published       : false
    };

    newsletter.save(attrs);
  }

  return view;
});