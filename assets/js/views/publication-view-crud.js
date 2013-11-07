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
    publication.save();
  };


  view.prototype.editPublication = function(){
    var params = this.kollector();
    this.model.save(params);
  };


  view.prototype.destroyPublication = function(){
    var confirm = window.confirm('Are you sure you want to delete this publication? All corresponding newsletters, stories and images will also be deleted. This data is not recoverable! Srsly... you better be sure');
    if(confirm) this.model.destroy();
  };


  view.prototype.kollector = function(){
    // Collect and cleanup pasted in json
    var channels = $(this.el).find('#channels').val().replace(/\n/g, '').replace(/\r/g, '');

    // Set a default value for channels if nothing specified
    if(!channels.length) channels = '[]';

    var channelsJSON = '[]';
    channelsJSON = JSON.parse(channels);
    try{ channelsJSON = JSON.parse(channels); }
    catch(e) { alert('bad json dude'); }

    return {
      title     : $(this.el).find('#title').val(),
      channels  : channelsJSON
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