define(function(){
  'use strict';

  return function(match){
    match('', 'publication#showAll');
    match('publications', 'publication#showAll');
    match('publication/:id', 'publication#showOne');
    match('/publication/:id', 'publication#showOne');
    match('newsletter/:id', 'newsletter#showOne');
    match('/newsletter/:id', 'newsletter#showOne');
  }
});