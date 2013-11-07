define([
  'handlebars'
], function(Handlebars){
  'use strict';

  var channelHelpersExist = function(channels, opts){
    var active  = _.findWhere(channels, { active : true });
    var ret     = opts.inverse(this);
    if(active && active['template-helpers']) ret = opts.fn(this);

    return ret
  }

  Handlebars.registerHelper('channelHelpersExist', channelHelpersExist);
  return new Handlebars.SafeString(channelHelpersExist);
});