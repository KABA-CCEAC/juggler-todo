var path = require('path');

// This is the main application configuration file.  It is a Grunt
// configuration file, which you can learn more about here:
// https://github.com/cowboy/grunt/blob/master/docs/configuring.md
//
module.exports = function(grunt) {

  // Needed vars to start
  var phonegapLib = path.normalize('/Development/phonegap-2.3.0/lib')
    , reverseDomain = 'com.example'
    , projectName = 'todo';

  // import tasks
  grunt.loadNpmTasks('grunt-contrib');
  //grunt.loadNpmTasks('grunt-contrib-jade'); /* as long default jade won't allow wildcard for target files */
  grunt.loadNpmTasks('grunt-shell');
  //grunt.loadTasks("tasks");

  grunt.initConfig({

    meta: {
      location: path.normalize(__dirname),
      locationIOS: path.normalize(path.join(__dirname, 'ios')),
      locationAndroid: path.normalize(path.join(__dirname, 'android')),
      reverseDomain: reverseDomain,
      projectName: projectName
    },

    shell: {
      /* create phonegap projects */
      createIOS: {
        command: path.normalize('./ios/bin/create') + ' <%= meta.locationIOS %> <%= meta.reverseDomain %>.<%= meta.projectName %> <%= meta.projectName %>',
        stdout: true,
        execOptions: {
            cwd: phonegapLib
        }
      },
      createAndroid: {
        command: path.normalize('./android/bin/create') + ' <%= meta.locationAndroid %> <%= meta.reverseDomain %>.<%= meta.projectName %> <%= meta.projectName %>',
        stdout: true,
        execOptions: {
            cwd: phonegapLib
        }
      },
      copyToAndroidSim: {
        command: 'adb install -r ' + path.normalize('android/bin/todo-debug.apk'),
        stdout: true
      }
    },

    clean: {
      boiler: ['boiler/**/*'],
      iOS: ['ios/www/*'],              /* clean iOS webroot */
      android: ['android/assets/www/*' ]   /* clean android webroot */
    },

    /* phonegap cli bridge - iOS */
    iOS: {
      emulate: {
        bin: 'run' /* brew install ios-sim */
      },
      debug: {
        bin: 'build'
      },
      release: {
        bin: 'release'
      },
      log: {
        bin: 'log'
      }
    },

    /* phonegap cli bridge - Android */
    android: {
      emulate: {
        bin: 'run'
      },
      debug: {
        bin: 'build'
      },
      release: {
        bin: 'release'
      },
      log: {
        bin: 'log'
      },
      clean: {
        bin: 'clean'
      }
    },

    copy: {
      /* common client */
      boilClient: {
        options: { basePath: "www/client" },
        files: {
          "boiler/src/": ["www/client/**/*"]
        }
      },
      /* specific iOS */
      boilIOS: {
        options: { basePath: "www/iOS" },
        files: {
          "boiler/src/": ["www/iOS/**/*"]
        }
      },
      /* specific Android */
      boilAndroid: {
        options: { basePath: "www/android" },
        files: {
          "boiler/src/": ["www/android/**/*"]
        }
      },

      /* copy assets to dist */
      srcToDist: {
        options: { basePath: "boiler/src"},
        files: {
          "boiler/dist/": [
            "boiler/src/assets/img/**/*",
            "boiler/src/assets/font/**/*",
            "boiler/src/assets/js/libs/cordova-2.3.0.js"
        ]}
      },
      genToDist: {
        options: { basePath: "boiler/gen"},
        files: {
          "boiler/dist/": [
            "boiler/gen/index.html"
        ]}
      },

      /* release iOS */
      distToIOS: {
        options: { basePath: "boiler/dist" },
        files: {
          "ios/www/": ["boiler/dist/**/*"]
        }
      },
      /* release Android*/
      distToAndroid: {
        options: { basePath: "boiler/dist" },
        files: {
          "android/assets/www/": ["boiler/dist/**/*"]
        }
      }
    },

    /* build the webproject 
    * Templates: jade -> handlebars -> JST
    * Stylesheet: stylus -> mincss -> one css
    * Javascript: app -> requirejs -> concat -> one js
    */
    jade: {
      compile: {
        options: { },
        files: {
          "boiler/src/assets/templates/*.html": ["boiler/src/app/modules/**/*.jade"]
        }
      },
      debugIndex: {
        options: {
          data: {
            options: { debug: true }
          }
        },
        files: {
          "boiler/src/index.html": ["boiler/src/index.jade"]
        }
      },
      releaseIndex: {
        options: {
          data: {
            options: { debug: false }
          }
        },
        files: {
          "boiler/gen/index.html": ["boiler/src/index.jade"]
        }
      }
    },

    stylus: {
      compile: {
        options: {
          // paths: ['path/to/import', 'another/to/import'],
          // urlfunc: 'embedurl', // use embedurl('test.png') in our code to trigger Data URI embedding
          // use: [
          //   require('fluidity') // use stylus plugin at compile time
          // ]
        },
        files: {
          "boiler/src/assets/css/main.css": [
            "boiler/src/stylus/main.styl"//"client/stylus/**/*.styl"
          ]}
      }
    },

    handlebars: {
      compile: {
        options: {
          processName: function(filename) {
            var pieces = filename.split("/");
            var name = '';
            for (var i = 4, len = pieces.length; i < len; i++) {
              name += pieces[i] + '/';
            }
            return name.replace('.html/', '');
          }
          //namespace: "JST"
        },
        files: {
          "boiler/gen/templates.js": [
            "boiler/src/assets/templates/**/*.html"
          ]
        }
      }
    },

    requirejs: {
      compile: {
        options: {
          //baseUrl: "path/to/base",
          mainConfigFile: "boiler/src/app/config.js",
          out: "boiler/gen/require.js",
          name: "config",
          wrap: false
        }
      }
    },

    concat: {
      "boiler/dist/assets/js/app.js": [
        "boiler/src/assets/js/libs/almond.js",
        "boiler/gen/templates.js",
        "boiler/gen/require.js"
      ]
    },

    mincss: {
      compress: {
        files: {
          "boiler/dist/assets/css/index.css": [
            "boiler/src/assets/css/ratchet-1.0.0.css",
            "boiler/src/assets/css/kesign-mobile-0.0.1.css",
            "boiler/src/assets/css/font-awesome-3.0.css",
            "boiler/src/assets/css/main.css"
          ]
        }
      }
    },


    // // Running debug/preview server
    server: {
      //root: "boiler/src/",
      index: "boiler/src/index.html",
      // files: { "index.html": "boiler/src/index.html" },

      folders: {
          "assets": "boiler/src/assets",
          "app": "boiler/src/app"
      },

      dist: {
        // These two options make it easier for deploying, by using whatever
        // PORT is available in the environment and defaulting to any IP.
        host: "0.0.0.0",
        port: process.env.PORT || 8000,

        index: "boiler/dist/index.html",
        // files: { "index.html": "boiler/src/index.html" },

        folders: {
            "assets": "boiler/dist/assets"
        }
      }
    },

    watch: {
      iOS: {
        files: ["www/client/**/*", "www/iOS/**/*"],
        tasks: "iOS:boil"
      },
      android: {
        files: ["www/client/**/*", "www/android/**/*"],
        tasks: "android:boil"
      }
    }

  });

  grunt.registerTask('iOS:create', 'shell:createIOS');
  grunt.registerTask('iOS:boil', 'clean:boiler copy:boilClient copy:boilIOS stylus jade');
  grunt.registerTask('iOS:dist', 'iOS:boil handlebars requirejs concat mincss copy:srcToDist copy:genToDist');
  grunt.registerTask('iOS:build', 'clean:iOS iOS:dist copy:distToIOS iOS:debug');
  grunt.registerTask('iOS:watch', 'watch:iOS');

  grunt.registerTask('android:create', 'shell:createAndroid');
  grunt.registerTask('android:boil', 'clean:boiler copy:boilClient copy:boilAndroid stylus jade');
  grunt.registerTask('android:dist', 'android:boil handlebars requirejs concat mincss copy:srcToDist copy:genToDist');
  grunt.registerTask('android:build', 'android:clean clean:android android:dist copy:distToAndroid android:debug');
  grunt.registerTask('android:watch', 'watch:android');
  grunt.registerTask('android:copyToSim', 'shell:copyToAndroidSim');
 
  grunt.registerTask('build', 'iOS:build android:build');

};
