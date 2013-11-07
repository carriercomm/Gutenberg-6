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
      'click .revoke-editor'  : 'revokeEditor',
      'click .revoke-owner'   : 'revokeOwner',
      'click .make-editor'    : 'makeEditor',
      'click .make-owner'     : 'makeOwner'
    }
  });


  view.prototype.render = function(){
    // Show auth or deauth button?
    var publication = this.options.publication;
    var owners      = publication.get('owners');
    var editors     = publication.get('editors');
    var myId        = this.model.get('id');

    if(owners.indexOf(myId) != -1) this.model.set('isOwner', true);
    if(editors.indexOf(myId) != -1) this.model.set('isEditor', true);

    Chaplin.View.prototype.render.apply(this, arguments);

    // Set the URL to the User
    var earl = '/ui/user/' + this.model.get('id');
    $(this.el).attr('href', earl);
  };


  view.prototype.makeEditor = function(e){
    e.preventDefault();
    e.stopPropagation();

    console.log('auth');
  };


  view.prototype.revokeEditor = function(e){
    e.preventDefault();
    e.stopPropagation();

    var confirm = window.confirm('Are you sure you want to deauth this user');
  };


  view.prototype.makeOwner = function(e){
    e.preventDefault();
    e.stopPropagation();

    console.log('make');
  };


  view.prototype.revokeOwner = function(e){
    e.preventDefault();
    e.stopPropagation();

    console.log('revoke');
  };

  return view;
});