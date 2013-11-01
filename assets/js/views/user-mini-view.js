define([
  'chaplin',
  'views/base/view',
  'text!templates/userMini.hbs'
], function(Chaplin, View, template){
  'use strict';

  var view = View.extend({
    tagName       : 'a',
    className     : 'list-group-item',
    template      : template,
    events        : {
      'click .deauthorize' : 'deauthorize'
    }
  });


  view.prototype.render = function(){
    Chaplin.View.prototype.render.apply(this, arguments);
    var earl = '/ui/user/' + this.model.get('id');
    $(this.el).attr('href', earl);
  };


  view.prototype.deauthorize = function(e){
    e.preventDefault();
    e.stopPropagation();

    var confirm = window.confirm('Are you sure you want to deauth this user');
    //if(confirm) this.model.destroy();
  };

  return view;
});