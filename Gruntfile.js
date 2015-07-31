/* jshint node: true */
module.exports = function(grunt) {
    // Do grunt-related things in here

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),

        compass: { // Task
            dist: { // Target
                options: { // Target options
                    sassDir: "./styles/scss/",
                    cssDir: "./styles/css/"
                }
            }
        },

        watch: {
            sass: {
                files: ["./styles/**/*.scss"],
                tasks: ["compass:dist", "default"]
            },
            react: {
                files: ["scripts/react/**/*.js"],
                tasks: ["browserify"]
            }
        },

        concat: {
            options: {
                separator: '\n '
            },

            cssLibs: {
                src: [
                    "app/normalize/normalize.css",
                    "app/components-font-awesome/css/font-awesome.min.css",
                    "app/bootstrap/dist/css/bootstrap.css",
                    "app/angular-ui-notification/dist/angular-ui-notification.min.css"
                ],
                dest: 'dist/css/<%= pkg.name %>.libs.css'
            },

            reactExternalScripts: {
                src: [
                    "app/react/react.js",
                    "app/react/JSXTransformer.js",
                    "app/lodash/lodash.min.js"
                ],
                dest: 'dist/js/<%= pkg.name %>.libs.js'
            }

        },

        copy: {
            main: {
                src: 'styles/css/application.css',
                dest: 'dist/css/<%= pkg.name %>.css'
            },
            fontAwesome: {
                cwd: 'app/components-font-awesome/fonts',  // set working folder / root to copy
                src: '**/*',           // copy all files and subfolders
                dest: 'dist/fonts',    // destination folder
                expand: true           // required when using cwd
            },
            bootstrap: {
                cwd: 'app/bootstrap/fonts',  // set working folder / root to copy
                src: '**/*',           // copy all files and subfolders
                dest: 'dist/fonts',    // destination folder
                expand: true           // required when using cwd
            }
        },

        browserify: {
            options: {
                transform: [require('grunt-react').browserify]
            },
            client: {
                src: ['scripts/react/**/*.js'],
                dest: 'dist/js/<%= pkg.name %>.js'
            }
        },

        "babel": {
            options: {
                sourceMap: true
            },
            dist: {
                src: ['scripts/react/components/MainApp.js'],
                dest: 'dist/js/<%= pkg.name %>.js'
            }
        }
    });

    grunt.loadNpmTasks("grunt-contrib-compass");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-browserify");
    grunt.loadNpmTasks("grunt-babel");
    //STEP3: Default task(s).

    grunt.registerTask("buildReact", [
        "compass:dist",
        "concat:cssLibs",
        "copy",
        "concat:reactExternalScripts",
        "babel"
        //"browserify"
        //"concat:reactInternalScripts"
    ]);

    grunt.registerTask("default", ["buildReact"]);
};
