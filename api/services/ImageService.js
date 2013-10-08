var path    = require('path');
var knox    = require('knox');
var magik   = require('gm');
var fs      = require('fs');
var crypto  = require('crypto');

if(process.env.S3_KEY){
  var knoxClient = knox.createClient({
    key     : process.env.S3_KEY,
    secret  : process.env.S3_SECRET,
    bucket  : process.env.S3_BUCKET
  });
};

module.exports = {

  write : function(filePath, next){
    if(typeof(knoxClient) != 'undefined'){

      knoxClient.putFile(filePath, path.basename(filePath), function(err, as3Res){
        if(err) console.error(err)

        var finalPath = 'https://s3.amazonaws.com/' + path.join(process.env.S3_BUCKET, path.basename(filePath));
        next(finalPath);
      });

    } else{
      // Use the local file system if a remote image store is note defined
      // this is useful local development
      var fileName = path.join(process.cwd(), 'uploads', path.basename(filePath));

      fs.readFile(filePath, function(err, data){
        if(err) console.log(err)
        fs.writeFile(fileName, data, 'base64', function(err){
          if(err) console.log(err)

          var urlPath = path.join('/uploads', path.basename(filePath))
          next(urlPath);
        })
      });
    };
  },


  get : function(filePath, next){
    if(knoxClient){

      var remotePath = path.basename(filePath);
      var localPath  = path.join('uploads', crypto.randomBytes(20).toString('hex'));
      var buffer     = '';

      knoxClient.get(remotePath).on('response', function(res){
        res.setEncoding('binary');

        res.on('data', function(chunk){ buffer += chunk; });
        res.on('end', function(){
          fs.writeFile(localPath, buffer, 'binary', function(err){
            if(err) console.error(err)

            next(localPath);
          })
        })
      }).end();

    } else return filePath
  },


  crop : function(filePath, coords, next){
    // if no x coords, assume it's just a resize
    if(!coords.x){
      magik(filePath).resize(coords.w, coords.h)
        .write(filePath, function(err){
          if(err) console.log(err);
          next(filePath)
        });
    } else{
      magik(filePath).crop(coords.w, coords.h, coords.x, coords.y)
        .resize(coords.w, coords.h)
        .write(filePath, function(err){
          if(err) console.log(err);
          next(filePath);
        });
    }
  },


  destroy : function(url){

    // Delete from current directory if it's a relative filepath
    if(url.indexOf('http://') == -1 && url.indexOf('https://') == -1){

      var filePath = path.join(process.cwd(), url);
      fs.unlink(filePath, function (err) {
        if (err) console.log(err);
      });
    }

    // TODO - delete as3 image
  }

};