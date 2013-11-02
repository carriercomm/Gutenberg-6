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
    },
    listen        : {
      'owner_editor_update mediator' : 'reRender'
    }
  });


  view.prototype.reRender = function(model){
    this.render();
  }


  view.prototype.render = function(){

    // Set model attributes for easy button show/hide
    var publication = this.options.publication;
    var owners      = publication.get('owners');
    var editors     = publication.get('editors');
    var myId        = this.model.get('id').toString();

    if(owners.indexOf(myId) != -1) this.model.set('isOwner', true);
    else this.model.set('isOwner', false)

    if(editors.indexOf(myId) != -1) this.model.set('isEditor', true);
    else this.model.set('isEditor', false)

    Chaplin.View.prototype.render.apply(this, arguments);

    // Set the data-id to the dom for easy user reference
    $(this.el).attr('data-id', myId);

    // Set the URL to the Passport User
    var earl = 'http://passport.vml.com/ui/user/' + this.model.get('username');
    $(this.el).attr('href', earl);

    // Set data attributes for easy live filtering
    if(this.model.get('isOwner')) $(this.el).attr('data-isowner', true)
    if(this.model.get('isEditor')) $(this.el).attr('data-iseditor', true)
    if(!this.model.get('isEditor') && !this.model.get('isOwner')) $(this.el).attr('data-unauthorized', true)
  };

  
  view.prototype.handleButton = function(e){
    e.preventDefault();
    e.stopPropagation();

    var username  = $(e.currentTarget).parent().find('.name').html().trim();
    var userId    = $(e.currentTarget).parent().data('id').toString();
    var action    = $(e.currentTarget).data('action');

    this[action](username, userId);
  };


  view.prototype.makeEditor = function(username, userId){
    var editors = this.options.publication.get('editors');
    editors.push(userId.toString());
    this.options.publication.set('editors', editors);
    this.options.publication.save();
  };


  view.prototype.revokeEditor = function(username, userId){
    var message = 'Are you sure you want to revoke editorial privileges for ' + username + '? ' + username + ' will no longer be able to contribute to publications.';
    var confirm = window.confirm(message);

    if(confirm){
      var editors = this.options.publication.get('editors');
      var index   = editors.indexOf(userId);
      editors.splice(index, 1);
      this.options.publication.set('editors', editors);
      this.options.publication.save();
    }
  };


  view.prototype.makeOwner = function(username, userId){
    // Add to owners array
    var owners = this.options.publication.get('owners');
    owners.push(userId.toString());
    this.options.publication.set('owners', owners);

    // If an editor, remove from editor array
    var editors = this.options.publication.get('editors');
    var index   = editors.indexOf(userId);
    editors.splice(index, 1);
    this.options.publication.set('editors', editors);

    this.options.publication.save();
  };


  view.prototype.revokeOwner = function(username, userId){
    //TODO - reassign as an editor
    var message = 'Are you sure you want to revoke ownership privileges for ' + username + '? ' + username + ' will no longer be able to modify users for this publication and will be downgraded to an editorial role.';
    var confirm = window.confirm(message);

    if(confirm){
      // Remove from owners array
      var owners  = this.options.publication.get('owners');
      var index   = owners.indexOf(userId);
      owners.splice(index, 1);
      this.options.publication.set('owners', owners);

      // Reassign to editors array
      var editors = this.options.publication.get('editors');
      editors.push(userId.toString());
      this.options.publication.set('editors', editors);

      this.options.publication.save();
    }
  };

  return view;
});