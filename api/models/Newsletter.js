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
      required    : true,
      defaultsTo  : 'New Newsletter',
      type        : 'STRING',
      maxLength   : 256
    },
    publication_id : {
      type        : 'STRING',
      defaultsTo  : 0
    },
    published : {
      type        : 'BOOLEAN',
      defaultsTo  : false
    }
  }
};
