module.exports = function (grunt) {

  var cssFilesToInject = [
    'linker/**/*.css'
  ];

  var jsFilesToInject = [
    'linker/js/vendor/require.js'
  ];

  var templateFilesToInject = [
    'linker/**/*.hbs'
  ];



  // Modify css file injection paths to use 
  cssFilesToInject = cssFilesToInject.map(function (path) {
    return '.tmp/public/' + path;
  });

  // Modify js file injection paths to use 
  jsFilesToInject = jsFilesToInject.map(function (path) {
    return '.tmp/public/' + path;
  });

  templateFilesToInject = templateFilesToInject.map(function (path) {
    return 'assets/' + path;
  });


  // Get path to core grunt dependencies from Sails
  var depsPath = grunt.option('gdsrc') || 'node_modules/sails/node_modules';
  grunt.loadTasks(depsPath + '/grunt-contrib-clean/tasks');
  grunt.loadTasks(depsPath + '/grunt-contrib-copy/tasks');
  grunt.loadTasks(depsPath + '/grunt-contrib-concat/tasks');
  grunt.loadTasks(depsPath + '/grunt-sails-linker/tasks');
  grunt.loadTasks(depsPath + '/grunt-contrib-jst/tasks');
  grunt.loadTasks(depsPath + '/grunt-contrib-watch/tasks');
  grunt.loadTasks(depsPath + '/grunt-contrib-uglify/tasks');
  grunt.loadTasks(depsPath + '/grunt-contrib-cssmin/tasks');
  grunt.loadNpmTasks('grunt-contrib-requirejs');


  grunt.initConfig({
    pkg : grunt.file.readJSON('package.json'),

    requirejs : {
      compile : {
        options : {
          baseUrl         : 'assets/linker/js',
          name            : 'start',
          mainConfigFile  : 'assets/linker/js/require-config.js',
          out             : 'assets/js/optimized.js'
        }
      }
    },

    copy : {
      dev : {
        files : [
          {
            expand  : true,
            cwd     : './assets',
            src     : ['**/*'],
            dest    : '.tmp/public'
          }
        ]
      }
    },

    clean : {
      dev   : ['.tmp/public/**']
    },

    jst: {
      dev: {
        options: {
          templateSettings: {
            //interpolate: /\{\{(.+?)\}\}/g
          }
        },
        files: {
          '.tmp/public/jst.js': templateFilesToInject
        }
      }
    },

    concat : {
      js : {
        src  : jsFilesToInject,
        dest : '.tmp/public/concat/production.js'
      },
      css: {
        src  : cssFilesToInject,
        dest : '.tmp/public/concat/production.css'
      }
    },

    uglify : {
      dist : {
        src  : ['.tmp/public/concat/production.js'],
        dest : '.tmp/public/min/production.js'
      }
    },

    cssmin : {
      dist : {
        src  : ['.tmp/public/concat/production.css'],
        dest  : '.tmp/public/min/production.css'
      }
    },

    'sails-linker': {

      devJs : {
        options : {
          startTag  : '<!--SCRIPTS-->',
          endTag    : '<!--SCRIPTS END-->',
          fileTmpl  : '<script data-main="/linker/js/start.js" src="%s"></script>',
          appRoot   : '.tmp/public'
        },
        files : {
          'views/**/*.ejs'        : jsFilesToInject
        }
      },

      // TODO - fix files path here?
      prodJs : {
        options : {
          startTag  : '<!--SCRIPTS-->',
          endTag    : '<!--SCRIPTS END-->',
          fileTmpl  : '<script data-main="/linker/js/start.js" src="%s"></script>',
          appRoot   : '.tmp/public'
        },
        files : {
          'views/**/*.ejs': ['assets/js/optimized.js', 'assets/js/require-config.js', 'assets/js/vendor/require.js']
        }
      },

      devStyles : {
        options : {
          startTag  : '<!--STYLES-->',
          endTag    : '<!--STYLES END-->',
          fileTmpl  : '<link rel="stylesheet" href="%s">',
          appRoot   : '.tmp/public'
        },

        files : {
          'views/**/*.ejs' : cssFilesToInject
        }
      },

      prodStyles: {
        options: {
          startTag  : '<!--STYLES-->',
          endTag    : '<!--STYLES END-->',
          fileTmpl  : '<link rel="stylesheet" href="%s">',
          appRoot   : '.tmp/public'
        },
        files: {
          'views/**/*.ejs' : ['.tmp/public/min/production.css']
        }
      },

      // TODO - come back to this and implement
      devTpl : {
        options : {
          startTag  : '<!--TEMPLATES-->',
          endTag    : '<!--TEMPLATES END-->',
          fileTmpl  : '<script type="text/javascript" src="%s"></script>',
          appRoot   : '.tmp/public'
        },
        files : {
          'views/**/*.ejs' : ['.tmp/public/jst.js']
        }
      }
    },

    // TODO - is this even used?
    watch : {
      api : {
        files : ['api/**/*']
      },
      assets : {
        files   : ['assets/**/*'],
        tasks   : ['compileAssets', 'linkAssets']
      }
    }
  });


  grunt.registerTask('default', [
    'compileAssets',
    'linkAssets',
    'watch'
  ]);

  grunt.registerTask('compileAssets', [
    'clean:dev',
    'jst:dev',
    'copy:dev'
  ]);

  grunt.registerTask('linkAssets', [
    // Update link/script/template references in `assets` index.html
    'sails-linker:devJs',
    'sails-linker:devStyles',
    'sails-linker:devTpl'
  ]);

  // When sails is lifted in production
  grunt.registerTask('prod', [
    'clean:dev',
    'jst:dev',
    'copy:dev',
    'concat',
    'uglify',
    'cssmin',
    'requirejs',
    'sails-linker:prodJs',
    'sails-linker:prodStyles',
    'sails-linker:devTpl'
  ]);
};