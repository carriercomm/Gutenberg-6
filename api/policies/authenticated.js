/**
 * Allow any authenticated user.
 */

module.exports = function (req, res, next){

  if(req.transport == 'socket.io') next();
  else{

    var promptAuth = function(){
      res.header('WWW-Authenticate', 'Basic');
      res.send(401); 
    }

    if(req.headers.authorization){
      var encodedAuthString = req.headers.authorization.replace('Basic ', '')
      var authSplits        = new Buffer(encodedAuthString, 'base64').toString('ascii').split(':');
      var username          = authSplits[0];
      var password          = authSplits[1];

      if(username == process.env.USERNAME && password == process.env.PASSWORD){
        next();
      } else promptAuth();
    } else promptAuth();

  } 

};