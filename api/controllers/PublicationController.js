/**
 * PublicationController
 *
 * @module		:: Controller
 * @description	:: Contains logic for handling requests.
 */

module.exports = {

  redirect : function(req, res){
    res.redirect('/ui', 301)
  },

};
