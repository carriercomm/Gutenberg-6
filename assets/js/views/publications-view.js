define([
  'chaplin',
  'bootstrap',
  'views/base/collection-view',
  'views/publication-mini-view',
  'views/publication-view-crud',
  'text!templates/publicationMini.hbs',
  'text!templates/publications.hbs'
], function(Chaplin, bootstrap, CollectionView, PublicationMini, PublicationCrudView, miniTemplate, collectionTemplate){
  'use strict';

  var collectionView = CollectionView.extend({
    itemView      : PublicationMini,
    template      : collectionTemplate,
    listSelector  : '.list-group',
    events        : {
      'click #add-publication' : 'addPublication'
    }
  });


  collectionView.prototype.addPublication = function(e){
    e.preventDefault();

    var crudPublication = new PublicationCrudView({
      autoRender  : true,
      region      : 'main',
      className   : 'modal',
      attributes  : {
        'id' : 'crud-publication-modal'
      }
    });

  };

  return collectionView;
});