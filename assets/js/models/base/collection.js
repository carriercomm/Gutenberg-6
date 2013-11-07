define([
  'chaplin',
  'models/base/model'
], function(Chaplin, Model) {
  'use strict';

  var Collection = Chaplin.Collection.extend({
    model   : Model,
    params  : {},
    listen  : function(){
      var collection = this;

      socket.request(this.url, this.params, function(results){
        collection.add(results);
      });

      // I think this handler might have to be way more sophisticated
      // TODO:
        // Drop socket when collection is dropped, i thought chaplin said it would unbind
          // everything if the registration was done correctly
        // Do param matching either here, or on the server. I'm thinking it would be easier
          // to do it on the client, but better to do it on the server
      socket.on('message', function(message){
        if(message.verb == 'create') collection.add(message.data)
        else if(message.verb == 'destroy') collection.remove(message.id)
        else if(message.verb == 'update'){
          var model = collection.get(message.id)
          if(model){
            model.set(message.data);
          }
        }

        console.log(message);
      });
    }
  });

  return Collection;
});
