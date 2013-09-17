define([
  'chaplin'
], function(Chaplin) {
  'use strict';

  var Model = Chaplin.Model.extend({
    listen : function(){
      var model = this;
      socket.request(this.url, this.params, function(results){
        model.set(results);
      });

      socket.on('message', function(message, other){
        model.set(message.data);
      });
    }
  });

  return Model;
});
