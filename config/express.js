var express = require('../node_modules/sails/node_modules/express');

if(process.env.NODE_ENV == 'production' || process.env.NODE_ENV == 'stage'){
  module.exports.express = {
    bodyParser: function (){
      return express.bodyParser({
        uploadDir: process.env.STACKATO_FILESYSTEM
      });
    }
  }
}