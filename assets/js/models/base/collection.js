define([
  'chaplin',
  'models/base/model'
], function(Chaplin, Model) {
  'use strict';

  var Collection = Chaplin.Collection.extend({
    model   : Model,
    params  : {},
    listen  : function(next){
      var collection = this;

      socket.request(this.url, this.params, function(results){
        collection.add(results);
        if(next) next(results);
      });

      socket.on('message', function(message){
        if(message.verb == 'create') {
          // Loop over the message data and decide id the params match
          var truths  = 0;
          var keys    = Object.keys(collection.params);

          for(var i = 0; i<keys.length; i++){
            if(message.data[keys[i]] == collection.params[keys[i]]) truths++
          }
          if(truths >= keys.length) collection.add(message.data);

        } else if(message.verb == 'destroy') {
          collection.remove(message.id)
        } else if(message.verb == 'update'){
          // TODO: this could potentially blow up if a collection containing
          // the same model id of a different model type is used
          var model = collection.get(message.id)
          if(model) model.set(message.data);
        }
      });
    }
  });

  return Collection;
});
