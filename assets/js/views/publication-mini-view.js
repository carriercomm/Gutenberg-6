define([
  'chaplin',
  'views/base/view',
  'views/publication-view-crud',
  'text!templates/publicationMini.hbs'
], function(Chaplin, View, PublicationCrudView, miniTemplate){
  'use strict';

  var view = View.extend({
    tagName       : 'a',
    className     : 'list-group-item',
    template      : miniTemplate,
    events        : {
      'click .edit' : 'editPublication',
      'click'       : 'testAuth'
    }
  });


  view.prototype.render = function(){
    // Set editable and viewable props on the model
    var owners = this.model.get('owners');
    if(owners.indexOf(window.me.get('id')) != -1) this.model.set('viewable', true);
    if(window.me.get('isMaster') == true) this.model.set('editable', true);

    Chaplin.View.prototype.render.apply(this, arguments);

    // After render, modify the wrapping div to show the
    // viewable property
    if(this.model.get('viewable')){
      var earl = '/ui/publication/' + this.model.get('id');
      $(this.el).attr('href', earl);
    } else {
      $(this.el).addClass('unauthorized');
    }

    // Set a data attribute
    $(this.el).attr('data-id', this.model.get('id'))
  };


  view.prototype.editPublication = function(e){
    e.preventDefault();
    e.stopPropagation();

    var crudPublication = new PublicationCrudView({
      autoRender  : true,
      region      : 'main',
      className   : 'modal',
      model       : this.model,
      attributes  : {
        'id' : 'crud-publication-modal'
      }
    });

  };


  view.prototype.testAuth = function(e){
    if($(e.target).hasClass('unauthorized')){
      alert('You\'re not uathorized to view this publication. Please contact the publication owner to gain access');
    }
  }

  return view;
});