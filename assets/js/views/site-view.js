define([
  'views/base/view',
  'text!templates/site.hbs'
], function(View, template){

  var SiteView = View.extend({
    container : 'body',
    id        : 'site-container',
    className : 'container',
    template  : template,
    regions   : {
      main      : '#main-container'
    }
  });

  return SiteView;
});