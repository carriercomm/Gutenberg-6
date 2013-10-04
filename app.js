if(process.env.NODE_TIME_KEY){
  require('nodetime').profile({
    accountKey  : process.env.NODE_TIME_KEY,
    appName     : 'Gutenberg'
  });
}

// Start sails and pass it command line arguments
require('sails').lift(require('optimist').argv);