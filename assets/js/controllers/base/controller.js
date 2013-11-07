define([
  'chaplin',
  'views/site-view'
], function(Chaplin, SiteView){
  'use strict';

  var Controller = Chaplin.Controller.extend({
    beforeAction : function(){
      this.compose('site', SiteView)
    }
  });

  return Controller;
});