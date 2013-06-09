/*
 * grunt configuration file
 */
function exports(grunt) {
	'use strict';

	var jsFiles, testFiles, underscore;
	underscore = require('underscore');
	jsFiles = ['*.js', '**/*.js', '!node_modules/**'];
	testFiles = ['**/tests/**/*.js', '!node_modules/**'];
	// Project configuration.
	grunt.initConfig({
		mochaTest: {
			normal: testFiles
		},
		mochaTestConfig: {
			normal: {
				options: {
					reporter: 'spec',
					globals: []
				}
			}
		},
		watch: {
			test: {
				files: underscore.union(testFiles, jsFiles),
				tasks: ['jshint', 'mochaTest']
			}

		},
		jshint: {
			files: jsFiles,
			options: {
				bitwise : true,
				camelcase : true,
				forin : true,
				indent : true,
				noempty : true,
				nonew : true,
				plusplus : true,
				maxdepth : 8,
				maxcomplexity : 10,
				strict : true,
				quotmark : 'single',
				regexp : true,
				unused : 'strict',
				curly : true,
				eqeqeq : true,
				immed : true,
				latedef : true,
				newcap : true,
				noarg : true,
				sub : true,
				undef : true,
				boss : true,
				eqnull : true,
				node : true,
				es5 : true,
				dojo : false,
				passfail : false,
				trailing : true,
				scripturl : true,
				shadow : true,
				browser : false,
				smarttabs : true,
				globals : {
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-mocha-test');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('test', ['mochaTest']);
	// Default task.
	grunt.registerTask('default', ['jshint', 'mochaTest']);

}

module.exports = exports;