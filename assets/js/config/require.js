require.config({
  baseUrl     : '/js/',
  paths       : {
    'underscore'  : './vendor/underscore',
    'sailsio'     : './vendor/sails.io',
    'socketio'    : './vendor/socket.io',
    'jquery'      : './vendor/jquery',
    'backbone'    : './vendor/backbone',
    'chaplin'     : './vendor/chaplin',
    'text'        : './vendor/requirejs-text',
    'handlebars'  : './vendor/handlebars',
    'ejs'         : './vendor/ejs',
    'jcrop'       : './vendor/jquery.Jcrop',
    'bootstrap'   : './vendor/bootstrap',
    'uploader'    : './vendor/jquery.fineuploader-3.8.2',
    'sortable'    : './vendor/jquery.sortable',
    'wysiwyg'     : './vendor/bootstrap-wysiwyg',
    'hotkeys'     : './vendor/jquery.hotkeys'
  },
  shim        : {
    underscore    : {
      exports         : '_'
    },
    sailsio       : {
      deps            : ['socketio'],
      exports         : 'sailsio'
    },
    socketio      : {
      exports         : 'io'
    },
    backbone      : {
      deps            : ['underscore', 'jquery'],
      exports         : 'Backbone'
    },
    chaplin       : {
      deps            : ['backbone'],
      exports         : 'chaplin'
    },
    handlebars    : {
      exports         : 'Handlebars'
    }
    ejs           : {
      deps            : ['text'],
      exports         : 'ejs'
    },
    jcrop         : {
      deps            : ['jquery'],
      exports         : 'jcrop'
    },
    bootstrap     : {
      deps            : ['jquery'],
      exports         : 'bootstrap'
    },
    uploader      : {
      deps            : ['jquery'],
      exports         : 'qq'
    },
    sortable      : {
      deps            : ['jquery'],
      exports         : 'sortable'
    },
    wysiwyg       : {
      deps            : ['bootstrap', 'hotkeys'],
      exports         : 'wysiwyg'
    },
    hotkeys       : {
      deps            : ['jquery'],
      exports         : 'hotkeys'
    }
  },
  urlArgs             : 'bust=' + new Date().getTime()
});