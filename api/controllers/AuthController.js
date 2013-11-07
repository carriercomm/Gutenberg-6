/**
 * AuthController
 *
 * @module    :: Controller
 * @description :: Contains logic for handling requests.
 */

module.exports = {

  logout : function(req, res, next){
    AuthService.logout(req, res, next);
  }
};