module.exports = function (grunt) {

  // Get path to core grunt dependencies from Sails
  var depsPath = grunt.option('gdsrc') || 'node_modules/sails/node_modules';
  grunt.loadTasks(depsPath + '/grunt-contrib-clean/tasks');
  grunt.loadTasks(depsPath + '/grunt-contrib-copy/tasks');
  grunt.loadTasks(depsPath + '/grunt-contrib-concat/tasks');
  grunt.loadTasks(depsPath + '/grunt-contrib-watch/tasks');
  grunt.loadTasks(depsPath + '/grunt-contrib-cssmin/tasks');
  grunt.loadNpmTasks('grunt-contrib-requirejs');


  grunt.initConfig({
    pkg : grunt.file.readJSON('package.json'),

    requirejs : {
      compile : {
        options : {
          baseUrl         : '.tmp/working/js',
          name            : 'start',
          mainConfigFile  : '.tmp/working/js/config/require.js',
          out             : '.tmp/public/js/production.js',
          urlArgs         : '',
          include         : ['controllers/newsletter-controller', 'controllers/publication-controller'],
          optimize        : 'none'
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
      },
      prod : {
        files : [
          {
            expand  : true,
            cwd     : './assets',
            src     : ['**/*'],
            dest    : '.tmp/public'
          },
          {
            expand  : true,
            cwd     : './assets',
            src     : ['js/**/*', 'styles/**/*'],
            dest    : '.tmp/working'
          }
        ]
      }
    },

    clean : {
      dev   : ['.tmp/public/**', '.tmp/working/**'],
      prod  : ['.tmp/working/**']
    },

    concat : {
      css: {
        src  : ['.tmp/working/styles/**/*'],
        dest : '.tmp/working/concat/production.css'
      }
    },

    cssmin : {
      dist : {
        src  : ['.tmp/working/concat/production.css'],
        dest : '.tmp/public/styles/production.css'
      }
    },

    watch : {
      api : {
        files : ['api/**/*']
      },
      assets : {
        files   : ['assets/**/*'],
        tasks   : ['compileAssets']
      }
    }
  });
  
  // Check static assets for changes
  grunt.registerTask('default', ['compileAssets', 'watch']);

  grunt.registerTask('compileAssets', [
    'clean:dev',
    'copy:dev'
  ]);

  grunt.registerTask('prod', [
    'clean:dev',
    'copy:prod',
    'concat:css',
    'cssmin',
    'requirejs',
    'clean:prod'
  ]);
};