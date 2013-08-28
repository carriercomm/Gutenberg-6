require.config({
    baseUrl     : './js/',
    paths       : {
        'jquery'      : '../vendor/bower-components/jquery/jquery',
        'underscore'  : '../vendor/bower-components/underscore/underscore',
        'backbone'    : '../vendor/bower-components/backbone/backbone',
        'chaplin'     : '../vendor/bower-components/chaplin/chaplin'
    },
    shim        : {
        underscore  : {
            exports     : '_'
        },
        backbone    : {
            deps        : ['underscore', 'jquery'],
            exports     : 'Backbone'
        }
    },
    urlArgs     : 'bust=' +  (new Date()).getTime()
});

require(['application', 'routes'], function(Application, routes){
  new Application({ routes : routes, controllerSuffix : '-controller' });
});