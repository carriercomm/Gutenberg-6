define([
  'views/base/view',
  'text!templates/site.hbs'
], function(View, template){

  var view = View.extend({
    container : 'body',
    id        : 'site-container',
    className : 'container',
    template  : template,
    regions   : {
      main      : '#main-container'
    },
    listen    : {
      'crumbUpdate mediator' : 'crumbUpdate'
    }
  });

  view.prototype.crumbUpdate = function(opts){
    var html = '';

    if(opts.length){
      for(var i=0; i<opts.length; i++){
        if(i == opts.length - 1){
          html += '<li class="active">' + opts[i].title +'</li>';
        } else{
          html += '<li><a href="' + opts[i].route + '">' + opts[i].title +'</a></li>';
        }
      }
    }

    $(this.el).find('.breadcrumb').html(html);
  };

  return view;
});