/**
 * Newsletter
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 *
 */

module.exports = {
  attributes: {
    title : {
      type      : 'STRING',
      required  : true,
      maxLength : 256
    },
    publication_id : {
      type      : 'STRING',
      defaultsTo: 0
    },
    published : {
      type      : 'STRING',
      defaultsTo: 'false'
    }
  }
};
