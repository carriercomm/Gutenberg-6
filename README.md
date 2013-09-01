# Gutenberg

## Notes

### Dependencies not in the Repository
[FineUploader](http://fineuploader.com/) is a paid plugin and is not included in this projects repository. The application will run without it, but the experience will be slightly degraded.

### Upgrading Dependencies
I've made minor modifications to `vendor/fineuploader-3.8.2.css` as this was the easiest way to avoid duplicating bootstrap code in the primary style file. This also keeps modifications to [FineUploader](http://fineuploader.com/) as minimal as possible. Beware of upgrades to FineUploader as you'll lose these slight changes to it's CSS file...