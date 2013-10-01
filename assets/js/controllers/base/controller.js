define([
  'chaplin',
  'views/site-view'
], function(Chaplin, SiteView){
  'use strict';

  var Controller = Chaplin.Controller.extend({
    beforeAction : function(){
      Chaplin.Controller.prototype.beforeAction.apply(this, arguments);

      // Always compose the site view unless looking at a newlsetter preview
      if(arguments[1].action == 'preview' && arguments[1].controller == 'newsletter'){}
      else {this.compose('site', SiteView)};
    }
  });

  return Controller;
});