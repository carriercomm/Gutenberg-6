define([
  'chaplin',
  'models/base/model'
], function(Chaplin, Model) {
  'use strict';

  var Collection = Chaplin.Collection.extend({
    model   : Model,
    listen  : function(){
      var collection = this;

      socket.request(this.url, {}, function(results){
        collection.add(results);
      });

      socket.on('message', function(message){
        if(message.verb == 'create') collection.add(message.data)
        else if(message.verb == 'destroy') collection.remove(message.id)
        else if(message.verb == 'update'){
          var model = collection.get(message.id)
          model.set(message.data);
        }
      });
    }
  });

  return Collection;
});
