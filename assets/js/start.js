require(['chaplin', 'config/routes', 'socketio'], function(Chaplin, routes, io){
  window.io = io;

  require(['sailsio'], function(sailsio){
    window.socket = io.connect()
    socket.on('connect', function(){
        var app = Chaplin.Application.extend({
          title: 'Gutenberg'
        });
        new app({ routes : routes, controllerSuffix : '-controller', root : '/ui' });
    });

    // After going to sleep, some clients lose the socket connection.
    // Just refresh the page when this happens
    socket.on('disconnect', function(){
      location.reload();
    });
  });
});