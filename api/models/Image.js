/**
 * Image
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 *
 */

module.exports = {
  attributes: {
    url : {
      type      : 'STRING'
    },
    name : {
      type      : 'STRING',
      defaultsTo: '0'
    },
    story_id : {
      type      : 'STRING',
      defaultsTo: '0'
    },
    order : {
      type      : 'STRING',
      defaultsTo: '0'
    }
  }
};