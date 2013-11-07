require(['application', 'routes', 'socketio'], function(Application, routes, io){
  window.io = io;

  require(['sailsio'], function(sailsio){
    window.socket = io.connect()
    socket.on('connect', function(){
        new Application({ routes : routes, controllerSuffix : '-controller', root : '/ui' });
    });

    // After going to sleep, some clients lose the socket connection.
    // Just refresh the page when this happens
    socket.on('disconnect', function(){
      location.reload();
    });
  });
});