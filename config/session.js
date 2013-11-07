/**
 * Session
 * 
 * Sails session integration leans heavily on the great work already done by Express, but also unifies 
 * Socket.io with the Connect session store. It uses Connect's cookie parser to normalize configuration
 * differences between Express and Socket.io and hooks into Sails' middleware interpreter to allow you
 * to access and auto-save to `req.session` with Socket.io the same way you would with Express.
 *
 * For more information on configuring the session, check out:
 * http://sailsjs.org/#documentation
 */

if(process.env.NODE_ENV == 'production' || process.env.NODE_ENV == 'stage'){
  module.exports.session = {
    secret: process.env.SESSION_SECRET
  }
} else{
  module.exports.session = {
    secret: '3e3c3bcaa98b1df5f77cc01128d6fbc9'
  }
}