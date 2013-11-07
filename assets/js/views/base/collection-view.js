define([
  'handlebars',
  'chaplin/base/view',
], function(Chaplin, View){
  'use strict';

  var CollectionView = Chaplin.CollectionView.extend({
    getTemplateFunction : View.prototype.getTemplateFunction
  });
<<<<<<< HEAD
=======

  return CollectionView;
>>>>>>> dropping in chaplin boilerplate... as well as the handlebars library
});