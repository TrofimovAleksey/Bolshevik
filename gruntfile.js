module.exports = function(grunt) {

	require("load-grunt-tasks")(grunt);

  grunt.initConfig({
  	includereplace: {
      html: {
        src: "*.html", 
        dest: "build/",
        expand: true, 
        cwd: "source/"
      }
    },
  	// Очищаем папку build
  	clean: {
  		build: ["build"]
  	},
  	// Копируем файлы из папки source в папку build
  	copy: {
  		js: {
        expand: true,
        cwd: "source/js/",
        src: ["**"],
        dest: "build/js/",
      },
  		img: {
  			expand: true,
  			cwd: "source/img/",
  			src: ["**"],
  			dest: "build/img/"
  		},
      font: {
        expand: true,
        cwd: "source/font/",
        src: ["**"],
        dest: "build/font/"
      }
  	},
  	// Улучшаем LESS файл (отступы, порядок свойств и прочее)
  	csscomb: {
  	 	style: {
  	 		expand: true,
  	 		src: ["source/less/**/*.less"]
  	 	}
  	},
  	// Конвертируем LESS файлы в CSS
  	less: {
  		style: {
  			files: {
  				"build/css/main.css": ["source/less/main.less"]
  			}
  		}
  	},
  	// Добавляем префиксы
  	autoprefixer: {
  		options: {
  			browsers: ["last 10 version", "ie 10"]
  		},
  		style: {
  			src: "build/css/main.css"
  		}
  	},
  	// Объединяем медиа-выражения
  	cmq: {
  		style : {
  			files: {
  				"build/css/main.css": ["build/css/main.css"]
  			}
  		}
  	},
  	// Минимизиурем CSS
  	cssmin: {
  		style: {
  			options: {
  				keepSpecialComments: 0,
  				report: "gzip"
  			},
  			files: {
  				"build/css/main.min.css": ["build/css/main.css"]
  			}  			
  		}
  	},
  	// Объединяем несколько JS файлов
  	concat: {
      start: {
        src: [
          "source/js/script.js"
        ],
        dest: "build/js/script.min.js"
      }
    },
    // Минимизируем js файлы
    uglify: {
      start: {
        files: {
          "build/js/script.min.js": ["build/js/script.min.js"]
        }
      }
    },
    // Минимизируем html
  	htmlmin: {
  		options: {
  			removeComments: true,
  			collapseWhitespace: true,
  			collapseBooleanAttributes: true,
  			caseSensitive: true,
  			keepClosingSlash: false
  		},
  		html: {
  			files: {
          "build/index.min.html": "build/index.html"			
        }
  		}
  	},
  	// Отслеживаем изенения в указанных файлах и выполняем описанные действия
  	watch: {
      style: {
        files: ["source/less/**/*.less"],
        tasks: ["style"],
        options: {
          spawn: false,
          livereload: true
        },
      },
      scripts: {
        files: ["source/js/script.js"],
        tasks: ["js"],
        options: {
          spawn: false,
          livereload: true
        },
      },
      images: {
        files: ["source/img/**"],
        tasks: ["img"],
        options: {
          spawn: false,
          livereload: true
        },
      },
      html: {
        files: [
                "source/*.html", 
                "source/_html_block/**/*.html"
                ],
        tasks: ["includereplace:html"],
        options: {
          spawn: false,
          livereload: true
        },
      },
    }
  });
 
  grunt.registerTask("build",[
  	"clean",
  	"csscomb",
		"less",
		"autoprefixer",
		"cmq",
		"cssmin",
		"concat",
		"uglify",
		"copy",
		"includereplace",
		"htmlmin",
		"watch"
	]);

  grunt.registerTask("js",[
  	"concat",
  	"uglify",
  	"copy:js"
	]);

	grunt.registerTask("style",[
		"csscomb",
  	"less",
  	"autoprefixer",
  	"cmq",
  	"cssmin"
	]);

	grunt.registerTask("img",[
		"copy:img",
  	"less",
  	"autoprefixer",
  	"cmq",
  	"cssmin"
	]);

}