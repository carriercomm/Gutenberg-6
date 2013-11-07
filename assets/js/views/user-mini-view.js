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
    attributes    : {
      'target'    : 'blank'
    },
    events        : {
      'click .btn'    : 'handleButton',
    }
  });


  view.prototype.render = function(){
    // Show auth or deauth button?
    var publication = this.options.publication;
    var owners      = publication.get('owners');
    var editors     = publication.get('editors');
    var myId        = this.model.get('id').toString();

    if(owners.indexOf(myId) != -1) this.model.set('isOwner', true);
    if(editors.indexOf(myId) != -1) this.model.set('isEditor', true);

    Chaplin.View.prototype.render.apply(this, arguments);

    // Set the URL to the User
    var earl = 'http://passport.vml.com/ui/user/' + this.model.get('username');
    $(this.el).attr('href', earl);
    if(this.model.get('isOwner')) $(this.el).attr('data-isowner', true)
    if(this.model.get('isEditor')) $(this.el).attr('data-iseditor', true)
    if(!this.model.get('isEditor') && !this.model.get('isOwner')) $(this.el).attr('data-unauthorized', true)
  };

  
  view.prototype.handleButton = function(e){
    e.preventDefault();
    e.stopPropagation();

    var username  = $(e.currentTarget).parent().find('.name').html().trim();
    var action    = $(e.currentTarget).data('action');

    this[action](username);
  };


  view.prototype.makeEditor = function(username){
    
  };


  view.prototype.revokeEditor = function(username){
    var message = 'Are you sure you want to revoke editorial privileges for ' + username + '? ' + username + ' will no longer be able to contribute to publications.';
    var confirm = window.confirm(message);
  };


  view.prototype.makeOwner = function(username){
  };


  view.prototype.revokeOwner = function(username){
    var message = 'Are you sure you want to revoke ownership privileges for ' + username + '? ' + username + ' will no longer be able to modify users for this publication and will be downgraded to an editorial role.';
    var confirm = window.confirm(message);
  };

  return view;
});