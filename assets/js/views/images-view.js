define([
  'chaplin',
  'sortable',
  'views/base/collection-view',
  'views/image-view',
], function(Chaplin, Sortable, CollectionView, ImageView){

  var view = CollectionView.extend({
    noWrap        : true,
    template      : '<ul class="image-list"></ul>',
    listSelector  : '.image-list',
    itemView      : ImageView
  });


  view.prototype.initialize = function(){
    Chaplin.View.prototype.initialize.apply(this, arguments);

    this.collection.croppableItems = [];

    this.listenTo(this.collection, 'add', this.reRender);
    this.listenTo(this.collection, 'remove', this.reRender);
    this.listenTo(this.collection, 'change:sort_index', this.reRender);

    this.subscribeEvent('channels_registered', this.updateCropOptions);
  };


  view.prototype.updateCropOptions = function(channels){
    // loop over channels, reset crop options
    this.collection.croppableItems = [];
    for(var i=0; i<channels.length; i++){

      var obj = {
        domId       : channels[i].title.toLowerCase(),
        title       : channels[i].title,
        width       : channels[i].crop.width,
        height      : channels[i].crop.height,
        cropOptions : channels[i].crop.cropOptions
      }

      this.collection.croppableItems.push(obj);
    }
  };


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