require.config({
  baseUrl     : '/js/',
  paths       : {
    'jquery'      : './vendor/jquery',
    'underscore'  : './vendor/underscore',
    'handlebars'  : './vendor/handlebars',
    'hbs'         : './vendor/hbs',
    'ejs'         : './vendor/ejs',
    'backbone'    : './vendor/backbone',
    'chaplin'     : './vendor/chaplin',
    'text'        : './vendor/requirejs-text',
    'sailsio'     : './vendor/sails.io',
    'socketio'    : './vendor/socket.io',
    'jcolor'      : './vendor/jquery.color',
    'jcrop'       : './vendor/jquery.Jcrop',
    'bootstrap'   : './vendor/bootstrap',
    'uploader'    : './vendor/jquery.fineuploader-3.8.2',
    'sortable'    : './vendor/jquery.sortable',
    'wysiwyg'     : './vendor/bootstrap-wysiwyg',
    'hotkeys'     : './vendor/jquery.hotkeys'
  },
  shim        : {
    ejs           : {
      exports         : 'ejs',
      deps            : ['text']
    },
    hotkeys       : {
      exports         : 'hotkeys',
      deps            : ['jquery']
    },
    wysiwyg       : {
      exports         : 'wysiwyg',
      deps            : ['bootstrap', 'hotkeys']
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