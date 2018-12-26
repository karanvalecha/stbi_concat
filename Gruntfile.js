module.exports = function(grunt) {
  const parseConcatConfig = (configType, obj) => {
    const pathInfo = {};

    for (const fileType in obj[configType]) {
      pathInfo[fileType] = grunt.template
        .process(`<%= ${configType}.${fileType} %>`, {
          data: obj
        })
        .split(",");
    }
    return pathInfo;
  };

  const concatConfig = grunt.file.readJSON("concat.json");

  const srcPath = parseConcatConfig("src", concatConfig);
  const destPath = parseConcatConfig("dest", concatConfig);

  grunt.initConfig({
    watch: {
      all: {
        files: [
          ...srcPath.application_js,
          ...srcPath.initialization_js,
          ...srcPath.application_css,
          ...srcPath.html
        ],
        tasks: ["concat"],
        options: {
          spawn: false
        }
      }
    },
    concat: {
      application_js: {
        src: srcPath.application_js,
        dest: destPath.application_js[0]
      },
      initialization_js: {
        src: srcPath.initialization_js,
        dest: destPath.initialization_js[0]
      },
      application_css: {
        src: srcPath.application_css,
        dest: destPath.application_css[0]
      },
      html: {
        src: srcPath.html,
        dest: destPath.html[0]
      }
    }
  });

  // Default task
  grunt.registerTask("build:dev", ["concat:dev", "watch"]);

  // Concatination for all
  grunt.registerTask("concat:dev", ["concat"]);

  // Load up tasks
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-contrib-concat");
};
