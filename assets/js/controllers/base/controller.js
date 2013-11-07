define([
  'chaplin'
], function(Chaplin){
  'use strict';

  var Controller = Chaplin.Controller.extend({
    beforeAction : function(){
      console.log('before route');
    }
  });

  return Controller;
});