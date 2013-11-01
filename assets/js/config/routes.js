define(function(){
  'use strict';

  return function(match){
    // Publications
    match('', 'publication#list');
    match('publications', 'publication#list');
    match('publication/:id', 'publication#show');
    match('/publication/:id', 'publication#show');

    // Newsletter
    match('newsletter/:id', 'newsletter#queryHandler');
    match('/newsletter/:id', 'newsletter#queryHandler');

    // iFrame Previews
    match('preview/:id', 'newsletter#preview');
    match('/preview/:id', 'newsletter#preview');
  }
});