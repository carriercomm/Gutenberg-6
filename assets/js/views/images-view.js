define([
  'chaplin',
  'sortable',
  'views/base/collection-view',
  'views/image-view',
], function(Chaplin, Sortable, CollectionView, ImageView){

  var view = CollectionView.extend({
    noWrap        : true,
    template      : '<ul class="media-list image-list"></ul>',
    listSelector  : '.image-list',
    itemView      : ImageView,
    listen        : {
      'add collection'                : 'reRender',
      'remove collection'             : 'reRender',
      'change:sort_index collection'  : 'reRender'
    }
  });


  view.prototype.reRender = function(){
    var self = this;
    var $el  = $(this.el);

    if(!$(this.el).find('.image-list').hasClass('preventUpdate')){
      this.collection.sort();
      this.renderAllItems();
    }

    // Listen for updates to the image collection and
    // Reattach sorter when new images are added
    $el.find('.image-list').sortable('destroy');
    $el.find('.image-list').sortable().bind('sortupdate', function(e, ui){
      $el.find('.image-list').addClass('preventUpdate');
      self.reindexImages();
    });
  };


  view.prototype.reindexImages = function(){
    var self        = this;
    var $images     = $(this.el).find('li');
    var savedModels = 0;

    $.each($images, function(index, el){
      // Set the new sort index
      var modelId = $(el).find('.image').data('id');
      var model   = self.collection.get(modelId);
      model.set('sort_index', index);

      // Remove the prevent class if all models have been succesfully saved
      model.save(model.attributes, {
        success : function(){
          savedModels++;
          if(savedModels == $images.length) {
            $(self.el).find('.image-list').removeClass('preventUpdate');
          }
        }
      });
    });
  };

  return view
});