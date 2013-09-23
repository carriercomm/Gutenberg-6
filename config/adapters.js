/**
 * Global adapter config
 * 
 * The `adapters` configuration object lets you create different global "saved settings"
 * that you can mix and match in your models.  The `default` option indicates which 
 * "saved setting" should be used if a model doesn't have an adapter specified.
 *
 * Keep in mind that options you define directly in your model definitions
 * will override these settings.
 *
 * For more information on adapter configuration, check out:
 * http://sailsjs.org/#documentation
 */

if(process.env.NODE_ENV == 'production' || process.env.NODE_ENV == 'stage'){

  // Production Configuration options configured via env vars
  module.exports.adapters = {
    'default' : 'mongo',
    mongo     : {
      module    : 'sails-mongo',
      host      : process.env.MONGO_HOST,
      port      : process.env.MONGO_PORT,
      user      : process.env.MONGO_USER,
      password  : process.env.MONGO_PASS,
      database  : process.env.MONGO_DB_NAME
    }
  }
} else{

  // Use disk for local dev unless mongo is specified
  module.exports.adapters = {
    'default' : 'disk',
    disk      : {
      module : 'sails-disk'
    },
    mongo     : {
      module    : 'sails-mongo',
      host      : 'localhost',
      port      : 27017,
      user      : '',
      password  : '',
      database  : 'gutenberg'
    }
  }
}