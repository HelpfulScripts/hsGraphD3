/*global module:false*/
module.exports = function(grunt) {
    const sgc  = require('./sharedGruntConfig')(grunt, __dirname, [], 'lib', 'hsGraphD3');
	grunt.initConfig(sgc); 
};
