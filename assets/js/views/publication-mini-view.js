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
      'click .edit' : 'editPublication'
    }
  });


  view.prototype.render = function(){
    var owners = this.model.get('owners');
    if(window.me.get('isMaster') == true){
      this.model.set('editable', true);
    }

    Chaplin.View.prototype.render.apply(this, arguments);
    var earl = '/ui/publication/' + this.model.get('id');
    $(this.el).attr('href', earl);
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

  return view;
});