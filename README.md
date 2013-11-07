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
          "preview"         : "{{#each story}}<div class='story row-fluid'><div class='span4'><div class='gallery'><img alt='' src='' /></div></div><div class='span7'><h2 class='title'>{{title}}</h2><p class='body'>{{body}}</p></div></div>{{/each}}"
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


## Todo

### Client
* Drop the socket when the collection is no longer being used
* The listenTo method in the newsletter-controller is acting like an ASSHOLE and updating everything very strangely...

### Server
* When a publication is deleted, delete all of it's corresponding newsletters, stories, and images
* When a newsletter is deleted, delete all of it's corresponding stories and images

## Scripts
* Run script - `USERNAME=username PASSWORD=password forever -w app.js`
