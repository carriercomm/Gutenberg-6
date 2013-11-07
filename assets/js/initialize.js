require.config({
  baseUrl     : '/js/',
  paths       : {
    'jquery'      : '/vendor/jquery',
    'underscore'  : '/vendor/underscore',
    'handlebars'  : '/vendor/handlebars',
    'backbone'    : '/vendor/backbone',
    'chaplin'     : '/vendor/chaplin',
    'text'        : '/vendor/requirejs-text',
    'sailsio'     : '/vendor/sails.io',
    'socketio'    : '/vendor/socket.io',
    'jcolor'      : '/vendor/jquery.color',
    'jcrop'       : '/vendor/jquery.Jcrop',
    'bootstrap'   : '/vendor/bootstrap',
    'uploader'    : '/vendor/jquery.fineuploader-3.8.2',
    'sortable'    : '/vendor/jquery.sortable',
    'wysiwyg'     : '/vendor/bootstrap-wysiwyg'
  },
  shim        : {
    wysiwyg       : {
      exports         : 'wysiwyg',
      deps            : ['bootstrap']
    },
    sortable      : {
      exports         : 'sortable',
      deps            : ['jquery']
    },
    uploader      : {
      exports         : 'qq',
      deps            : ['jquery']
    },
    bootstrap     : {
      exports         : 'bootstrap'
    },
    jcrop         : {
      exports         : 'jcrop'
    },
    jcolor        : {
      exports         : 'jcolor'
    },
    sailsio       : {
        exports       : 'sailsio'
    },
    socketio      : {
        exports       : 'io'
    },
    underscore    : {
        exports       : '_'
    },
    backbone      : {
        deps          : ['underscore', 'jquery'],
        exports       : 'Backbone'
    },
    handlebars    : {
        exports       : 'Handlebars'
    }
  },
  urlArgs         : 'bust=' +  (new Date()).getTime()
});

require(['application', 'routes', 'socketio'], function(Application, routes, io){
  window.io = io;

  require(['sailsio'], function(sailsio){
    window.socket = io.connect()
    socket.on('connect', function(){
        new Application({ routes : routes, controllerSuffix : '-controller', root : '/ui' });
    });
  });
});