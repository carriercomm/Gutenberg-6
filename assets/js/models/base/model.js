define([
  'chaplin'
], function(Chaplin) {
  'use strict';

  var Model = Chaplin.Model.extend({
    listen : function(){
      console.log(this.url());

      socket.request(this.url(), this.params, function(results){
        console.log('connected', results);
      });

      socket.on('message', function(message, other){
        console.log(message)
      });
    }
  });

  return Model;
});
