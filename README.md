# Gutenberg

## What is Gutenberg?
Gutenberg is a **real time, collaborative, multi channel, content creation system**. It's purpose is to help publication authors better manage their content.

* Real Time - Content owners can see real time live previews of their pre published content as editors continue working. 
* Collaborative - A real time user interface allows multiple content creator's to manage the same piece of content at the same time.
* Multi Channel - A single piece of content can be streamed to an infinite number of channels. See what your content looks like in each channel before publishing.
* Content Creation System - Light weight wysiwyg's, bulk image uploading/manipulation, and a user management system make Gutenberg robust but still very easy to use.

    [
        {
            "title": "Email",
            "templates": {
                "preview"   : "...full html page... (pulled in via iframe)",
                "publish"   : "...abbreviated or full html page..."
            },
            "crop" : {
                "width"         : "200",
                "height"        : "200",
                "cropOptions"   : { "aspectRatio" : "1" }
            },
            "script": "...a post publish script you can use to deploy your published html page..."
        },
        {
            "title": "Passport",
            "templates": {
                "preview"   : "...full html page... (pulled in via iframe)",
                "publish"   : "...abbreviated or full html page..."
            },
            "crop" : {
                "width"         : "300",
                "height"        : "150",
                "cropOptions"   : { "aspectRatio" : "2" }
            },
            "script": "...a post publish script you can use to deploy your published html page..."
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
=======
## Where can I see this live?
The application is currently reliant on a corporate authentication system and a public web demo isn't currently an option. I'm working to abstract this logic and hope to get a public demo up soon.
>>>>>>> readme updates
=======
## Where can I see this live?
The application is currently reliant on a corporate authentication system and a public web demo isn't currently an option. I'm working to abstract this logic and hope to get a public demo up soon.
>>>>>>> f774b860a3d15f5879e8f89a76405d45edc879f7
