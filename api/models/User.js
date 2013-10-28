/**
 * User
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 *
 */

module.exports = {
  attributes: {
    username : {
      type        : 'STRING',
      maxLength   : 256
    },
    isMaster : {
      type        : 'BOOLEAN',
      defaultsTo  : true
    }
  },

};
