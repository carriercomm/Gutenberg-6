# Gutenberg


## Creating Publications
Publications are created via the interface. The `channel` property takes an optional configuration object. Sample:

    [
      {
        "title"             : "Email",
        "templates"         : {
          "preview"         : "<div class=''></div>",
          "publish"         : "<html><div class=''></div></html>"
        },
        "script"            : "..."
      },
      {
        "title"             : "Passport",
        "templates"         : {
          "preview"         : "<div class=''></div>",
          "publish"         : "<html><div class=''></div></html>"
        },
        "script"            : "..."
      }
    ]

Notice the example above contains a template object with multiple properties specified (preview and publish). This kind of configuration is necessary because most e-mail templates will still be developed using table based html layouts. Table based markup is not condusive to drag and drop interfaces and therefore multiple templates are necessary.

If no publish property is specified, the preview template will be used.


## Notes

### Dependencies not in the Repository
[FineUploader](http://fineuploader.com/) is a paid plugin and is not included in this projects repository. The application will run without it, but the experience will be slightly degraded.

### Upgrading Dependencies
I've made minor modifications to `vendor/fineuploader-3.8.2.css` as this was the easiest way to avoid duplicating bootstrap code in the primary style file. This also keeps modifications to [FineUploader](http://fineuploader.com/) as minimal as possible. Beware of upgrades to FineUploader as you'll lose these slight changes to it's CSS file...

## Scripts
* Run script - `forever -w app.js`