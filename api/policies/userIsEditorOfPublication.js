module.exports = function (req, res, next){

  var username = req.session.username || '';

  User.findOneByUsername(req.session.username).exec(function(err, userModel){
    if(err) console.log(err);

    if(userModel.isMaster) next();
    else {
      // If requesting a single publication
      if(req.params.id){
        Publication.findOneById(req.params.id).exec(function(err, publicationModel){
          var owners = publicationModel.owners || [];
          if(owners.indexOf(userModel.id) != -1){ next() }
          else { res.send(401) }
        });
      }

      // if requesting the publication listing
      else { next(); }
    }
  });

};