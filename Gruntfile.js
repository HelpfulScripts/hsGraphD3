/*global module:false*/
module.exports = function(grunt) {
    const sgc  = require('./sharedGruntConfig')(grunt, __dirname, [], 'lib');
	grunt.initConfig(sgc); 
};
