define([
  'handlebars',
  'chaplin/base/view',
], function(Chaplin, View){
  'use strict';

  var CollectionView = Chaplin.CollectionView.extend({
    getTemplateFunction : View.prototype.getTemplateFunction
  });
});