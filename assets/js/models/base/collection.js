define([
  'chaplin',
  'models/base/model'
], function(Chaplin, Model) {
  'use strict';

  var Collection = Chaplin.Collection.extend({
    model   : Model,
    params  : {},
    listen  : function(opts){
      var collection = this;

      socket.request(this.url, this.params, function(results){
        collection.add(results);
      });

      // TODO:
        // Drop socket when collection is dropped, i thought chaplin said it would unbind
          // everything if the registration was done correctly
      socket.on('message', function(message){
        if(message.verb == 'create') {
          if(opts.parentIdentifier){
            if(message.data[opts.parentIdentifier] == collection.params[opts.parentIdentifier]) {
              collection.add(message.data);
            }
          } else collection.add(message.data);
        } else if(message.verb == 'destroy') {
          collection.remove(message.id)
        } else if(message.verb == 'update'){
          var model = collection.get(message.id)
          if(model){
            model.set(message.data);
          }
        }
      });
    }
  });

  return Collection;
});
