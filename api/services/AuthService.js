// Optionall set up CAS stuff
if(process.env.CAS_AUTH){
  var baseURL = process.env.BASE_URL || 'http://localhost:1337/';
  var cas     = require('grand_master_cas');
  cas.configure({
      casHost       : 'cas.vml.com',
      casPath       : '/cas',
      ssl           : true,
      sessionName   : 'username',
      service       : baseURL,
      redirectUrl   : 'https://cas.vml.com'
  });
}


module.exports = {

  login : function(req, res, next){

    if(process.env.CAS_AUTH){
      cas.bouncer(req, res, function(){

        // Create a new user if one doesn't already exist with
        // a matching username
        if(req.session.username){
          User.findOneByUsername(req.session.username).exec(function(err, model){
            if(err) console.log(err)

            if(typeof(model) == 'undefined') {
              User.create({
                username : req.session.username
              }).done(function(err, newUser){
                if(err) console.log(err)
                next();
              });
            } else { next(); }
          });
        }
      });
    } else if(process.env.SIMPLE_AUTH){

      var promptAuth = function(){
        res.header('WWW-Authenticate', 'Basic');
        res.send(401); 
      };

      if(req.headers.authorization){
        var encodedAuthString = req.headers.authorization.replace('Basic ', '')
        var authSplits        = new Buffer(encodedAuthString, 'base64').toString('ascii').split(':');
        var username          = authSplits[0];
        var password          = authSplits[1];

        if(username == process.env.USERNAME && password == process.env.PASSWORD){
          next();
        } else promptAuth();
      } else promptAuth();
    } else{
      next();
    }
  },

  logout : function(req, res, next){
    if(process.env.CAS_AUTH){
      cas.logout(req, res, function(){});
    } else {
      // Should close the current window, but don't know how to make this work yet
      next();
    }
  }
}