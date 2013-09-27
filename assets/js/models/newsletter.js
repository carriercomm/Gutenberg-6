define([
  'chaplin',
  'models/base/model'
], function(Chaplin, Model){
  'use strict';

  var model = Model.extend({

    blacklist : ['stories', 'channels'],
    defaults  : {
      'title' : '',
      'tags'  : ''
    },
    toJSON    : function(options){
      return _.omit(this.attributes, this.blacklist);
    }
  });

  return model;
});