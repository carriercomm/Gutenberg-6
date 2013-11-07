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
      if(err) {
        res.view('index', { me : {} });
      } else {
        res.view('index', { me : userModel });
      }
    });
  }
  

};
