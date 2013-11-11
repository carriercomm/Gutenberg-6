define([
  'chaplin',
  'sortable',
  'views/base/collection-view',
  'views/video-view',
], function(Chaplin, Sortable, CollectionView, VideoView){

  var view = CollectionView.extend({
    noWrap        : true,
    template      : '<ul class="media-list video-list"></ul>',
    listSelector  : '.video-list',
    itemView      : VideoView,
    listen        : {
      'add collection'                : 'reRender',
      'remove collection'             : 'reRender',
      'change:sort_index collection'  : 'reRender'
    }
  });


  view.prototype.reRender = function(){
    var self = this;
    var $el  = $(this.el);

    if(!$(this.el).find('.video-list').hasClass('preventUpdate')){
      this.collection.sort();
      this.renderAllItems();
    }

    // Listen for updates to the image collection and
    // Reattach sorter when new images are added
    $el.find('.video-list').sortable('destroy');
    $el.find('.video-list').sortable().bind('sortupdate', function(e, ui){
      $el.find('.video-list').addClass('preventUpdate');
      self.reindexVideos();
    });
  };


  view.prototype.reindexVideos = function(){
    var self        = this;
    var $videos     = $(this.el).find('li');
    var savedModels = 0;

    $.each($videos, function(index, el){
      // Set the new sort index
      var modelId = $(el).find('.video').data('id');
      var model   = self.collection.get(modelId);
      model.set('sort_index', index);

      // Remove the prevent class if all models have been succesfully saved
      model.save(model.attributes, {
        success : function(){
          savedModels++;
          if(savedModels == $videos.length) {
            $(self.el).find('.video-list').removeClass('preventUpdate');
          }
        }
      });
    });
  };

  return view
});