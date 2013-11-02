/**
 * UtilityController
 *
 * @module		:: Controller
 * @description	:: Contains logic for handling requests.
 */

module.exports = {

  renderHome: function (req, res) {
    var username = req.session.username || '';

    User.findOneByUsername(username).exec(function(err, userModel){
      var user = userModel || {}
      if(err) console.log(err);
      res.view('index', { me : user, env : process.env.NODE_ENV });
    });
  }

};