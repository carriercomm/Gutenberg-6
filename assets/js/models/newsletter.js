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
    },
    prepForTemplateUsage : function(){
      var attrs   = _.clone(this.attributes);
      attrs.tags  = trimStringsInArr(attrs.tags.split(','));

      return attrs;
    }
  });

  var trimStringsInArr = function(arr){
    var newArr = [];
    for(var i=0; i<arr.length; i++){
      newArr.push(arr[i].replace(/^\s\s*/, '').replace(/\s\s*$/, ''));
    }

    return newArr
  };

  return model;
});