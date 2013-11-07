module.exports = function (req, res, next){

  User.findByUsername(req.session.username).exec(function(err, model){
    if(err) console.log(err);

    if(model.isMaster){ next(); }
    else { res.send(401); }
  });

};