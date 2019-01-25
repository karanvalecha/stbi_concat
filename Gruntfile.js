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
        tasks: ["concat", "babel"],
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
      }
    },
    babel: {
      options: {
        sourceMap: true
      },
      dist: {
        files: {
          "../stbi_server/public/stbi/scripts/application.js":
            destPath.application_js[0],
          "../stbi_server/public/stbi/scripts/initialization.js":
            destPath.initialization_js[0],
          "../stbi_server/public/stbi/css/application.css":
            destPath.application_css[0]
        }
      },
      plugins: ["css-modules-transform"]
    }
  });

  grunt.loadNpmTasks("grunt-babel");

  // Default task
  grunt.registerTask("build:dev", ["concat:dev", "babel", "watch"]);

  // Concatination for all
  grunt.registerTask("concat:dev", ["concat"]);

  // Load up tasks
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-contrib-concat");
};
