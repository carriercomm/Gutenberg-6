define([
  'chaplin',
  'views/base/view',
  'models/base/model',
  'text!templates/publicationCrud.hbs'
], function(Chaplin, View, Publication, template){
  'use strict';

  var view = View.extend({
    template  : template,
    events    : {
      'click .create'   : 'createNewPublication',
      'click .save'     : 'editPublication',
      'click .destroy'  : 'destroyPublication'
    }
  });


  view.prototype.createNewPublication = function(e) {
    var params      = this.kollector();
    var publication = new Publication(params);
    publication.url = '/publication/create'
    publication.save({
      success : function(){
        console.log('yehaw');
      }
    });
  };


  view.prototype.editPublication = function(){
    var params = this.kollector();
    this.model.save(params);
  };


  view.prototype.destroyPublication = function(){
    this.model.destroy();
  };


  view.prototype.kollector = function(){
    // Set a default value for channels if nothing specified
    var channels = $(this.el).find('#channels').val();
    if(!channels.length) channels = '[]'

    return {
      title     : $(this.el).find('#title').val(),
      channels  : JSON.parse(channels)
    }
  };


  view.prototype.render = function(){
    Chaplin.View.prototype.render.apply(this, arguments);

    // If there is a model, populate the textarea with something readable(ish)
    if(this.model){
      $(this.el).find('textarea').val(JSON.stringify(this.model.get('channels')));
    }

    // Not sure why this needs a timeout, but it would be nice if this went in
    // some kinf of post render method...
    setTimeout(function(){
      $('#crud-publication-modal').modal();
      $('#crud-publication-modal').on('hidden.bs.modal', function(){
        $('#crud-publication-modal').remove();
      });
    });
  };


  return view;
});