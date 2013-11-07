/**
 * Allow any authenticated user.
 */

module.exports = function (req, res, next){

  if(req.transport == 'socket.io') next();
  else{
    AuthService.login(req, res, function(){
      next();
    });
  } 

};