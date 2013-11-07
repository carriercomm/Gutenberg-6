module.exports.policies = {

  '*' : 'authenticated',
  PublicationController : {
    'destroy' : 'userIsMaster',
    'create'  : 'userIsMaster',
    'update'  : 'userIsOwnerOfPublication'
  }
};