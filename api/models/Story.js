/**
 * Story
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 *
 */

module.exports = {
  attributes: {
    newsletter_id : {
      type        : 'STRING',
      defaultsTo  : 0,
      required    : true
    },
    title : {
      type        : 'STRING',
      defaultsTo  : ''
    },
    body : {
      type        : 'TEXT',
      defaultsTo  : ''
    },
    teaser : {
      type        : 'STRING',
      defaultsTo  : ''
    }
  }
};
