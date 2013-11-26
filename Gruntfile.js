module.exports = function(grunt) {


  grunt.initConfig({
    uglify: {
 	build: {
	src: [],
	dest: ''
     } 
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('default', ['uglify']);


};
