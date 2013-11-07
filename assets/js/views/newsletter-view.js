define([
  'chaplin',
  'sortable',
  'views/base/collection-view',
  'views/story-view',
  'models/story',
  'text!templates/newsletter.hbs'
], function(Chaplin, Sortable, CollectionView, StoryView, Story, newsletterTemplate){
  'use strict';

  var view = CollectionView.extend({
    template      : newsletterTemplate,
    itemView      : StoryView,
    listSelector  : '#stories',
    attributes    : {
      'id'        : 'newsletter-view'
    },
    events        : {
      'click #add-story'    : 'addNewStory'
    }
  });

  view.prototype.addNewStory = function(e){
    e.preventDefault();

    var newsletter_id = this.model.get('id');
    var stories       = this.model.get('stories');
    var story         = new Story({ newsletter_id : newsletter_id, sort_index : stories.length });
    story.url         = '/story/create'
    story.save({
      success : function(){
        stories.add(story);
      }
    });
  };

  return view;
});