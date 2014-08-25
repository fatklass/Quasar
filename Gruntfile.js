module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'build/quasar.js',
        dest: 'build/quasar.min.js'
      }
    },
	watch : {
		scripts: {
			files: ['src/**/*.js'],
			tasks: ['concat', 'uglify'],
			options: {
				spawn: false,
			},
		},
	},
	concat:{
		options: {
			banner: "'use strict';\n",
		},
		basic_and_extras: {
			files: {
				'build/quasar.js': ['src/**/*.js', "lib/**/*.js"],
				'build/quasar.css': ['src/**/*.css']
			}
		}
	}
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['watch']);

};