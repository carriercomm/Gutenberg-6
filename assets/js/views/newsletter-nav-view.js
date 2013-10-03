define([
  'chaplin',
  'views/base/view',
  'text!templates/newsletterNav.hbs'
], function(Chaplin, View, template){
  'use strict';


  var view = View.extend({
    template      : template,
    tagName       : 'ul',
    className     : 'nav nav-tabs'
  });


  view.prototype.initialize = function(){
    Chaplin.View.prototype.initialize.apply(this, arguments);
    this.listenTo(this.model, 'change:channels', this.reRender);
  };


  view.prototype.reRender = function(){
    this.render();

    var channels = this.model.get('channels');
    var activeChannel = _.findWhere(channels, { active : true });
    var index = channels.indexOf(activeChannel);

    if(index != -1){
      $(this.el).find('a').each(function(iterator, $el){
        if(index == $(this).attr('data-index')) $(this).parent().addClass('active')
        else $(this).parent().removeClass('active')
      });
    }
  };

  return view;
});