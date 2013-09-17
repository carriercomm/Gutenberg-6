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

      socket.on('message', function(message){
        if(message.verb == 'create') {

          var truths  = 0;
          var keys    = Object.keys(collection.params);
          
          for(var i = 0; i<keys.length; i++){
            console.log('URL:                    ', self.url);
            console.log('Key:                    ', keys[i]);
            console.log('Message Value:          ', message.data[keys[i]]);
            console.log('Collection Param Value: ', collection.params[keys[i]]);
            console.log('Message:                ', message);
            console.log('------------------------');
            if(message.data[keys[i]] == collection.params[keys[i]]) truths++
          }

        console.log('<---------------------->');

          if(truths == keys.length) collection.add(message.data);

          /*if(opts.parentIdentifier){
            if(message.data[opts.parentIdentifier] == collection.params[opts.parentIdentifier]) {
              collection.add(message.data);
            }
          } else collection.add(message.data);
          */

        } else if(message.verb == 'destroy') {
          collection.remove(message.id)
        } else if(message.verb == 'update'){
          var model = collection.get(message.id)
          if(model) model.set(message.data);
        }
      });
    }
  });

  return Collection;
});
