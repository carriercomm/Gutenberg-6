module.exports.policies = {

  '*': 'authenticated',
  PublicationController : {
    'destroy' : 'userIsMaster'
  }
};