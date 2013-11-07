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
      defaultsTo  : 'New Newsletter',
      type        : 'STRING',
      maxLength   : 256
    },
    publication_id : {
      type        : 'STRING',
      defaultsTo  : 0
    },
    tags : {
      type        : 'STRING',
      defaultsTo  : ''
    },
    published : {
      type        : 'BOOLEAN',
      defaultsTo  : false
    }
  }
};
