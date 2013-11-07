require.config({
    baseUrl     : './js/',
    paths       : {
        'jquery'      : '../vendor/bower-components/jquery/jquery',
        'underscore'  : '../vendor/bower-components/underscore/underscore',
        'handlebars'  : '../vendor/bower-components/handlebars/handlebars',
        'backbone'    : '../vendor/bower-components/backbone/backbone',
        'chaplin'     : '../vendor/bower-components/chaplin/chaplin',
        'text'        : '../vendor/bower-components/requirejs-text/text',
    },
    shim        : {
        underscore  : {
            exports     : '_'
        },
        backbone    : {
            deps        : ['underscore', 'jquery'],
            exports     : 'Backbone'
        },
        handlebars  : {
            exports     : 'Handlebars'
        }
    },
    urlArgs     : 'bust=' +  (new Date()).getTime()
});

require(['application', 'routes'], function(Application, routes){
  new Application({ routes : routes, controllerSuffix : '-controller' });
});