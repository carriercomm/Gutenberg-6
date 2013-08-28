define(function(){
  'use strict';

  return function(match){
    match('', 'publication#showAll');
    match('/publication/:id', 'publication#showOne');
  }
});