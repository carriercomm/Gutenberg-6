module.exports = function (req, res, next){

  User.findOneByUsername(req.session.username).exec(function(err, userModel){
    if(err) console.log(err);

    if(userModel.isMaster) next();
    else {
      Publication.findOneById(req.params.id).exec(function(err, publicationModel){
        var owners = publicationModel.owners || [];
        if(owners.indexOf(userModel.id) != -1){ next() }
        else { res.send(401) }
      });
    }
  });

};