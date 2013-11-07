define(function(){
  'use strict';

  return function(match){
    match('', 'publication#list');
    match('publications', 'publication#list');
    match('publication/:id', 'publication#show');
    match('/publication/:id', 'publication#show');
    match('newsletter/:id', 'newsletter#show');
    match('/newsletter/:id', 'newsletter#show');
  }
});