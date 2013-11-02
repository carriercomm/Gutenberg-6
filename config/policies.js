module.exports.policies = {

  '*' : 'authenticated',
  PublicationController : {
    'destroy' : ['authenticated', 'userIsMaster'],
    'create'  : ['authenticated', 'userIsMaster'],
    'update'  : ['authenticated', 'userIsOwnerOfPublication'],
    'find'    : ['authenticated', 'userIsEditorOfPublication']
  },
  UserController : {
    '*'       : ['authenticated', 'userIsMaster'],
    'find'    : 'authenticated'
  }
};