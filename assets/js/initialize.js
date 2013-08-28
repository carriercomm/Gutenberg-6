require.config({
    baseUrl     : './js/',
    paths       : {
        'jquery'      : '../vendor/bower-components/jquery/jquery',
        'underscore'  : '../vendor/bower-components/underscore/underscore',
        'handlebars'  : '../vendor/bower-components/handlebars/handlebars',
        'backbone'    : '../vendor/bower-components/backbone/backbone',
        'chaplin'     : '../vendor/bower-components/chaplin/chaplin',
        'text'        : '../vendor/bower-components/requirejs-text/text',
        'sailsio'     : 'lib/sails.io',
        'socketio'    : 'lib/socket.io'
    },
    shim        : {
        sailsio     : {
            exports     : 'sailsio'
        },
        socketio    : {
            exports     : 'io'
        },
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

require(['application', 'routes', 'socketio'], function(Application, routes, io){
  window.io = io;

  require(['sailsio'], function(sailsio){
    window.socket = io.connect()
    socket.on('connect', function(){
        new Application({ routes : routes, controllerSuffix : '-controller' });
    });
  });
});