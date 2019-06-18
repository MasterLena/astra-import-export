module.exports = function( grunt ) {

	'use strict';
	// Project configuration
	grunt.initConfig( {

		pkg: grunt.file.readJSON( 'package.json' ),

		addtextdomain: {
			options: {
				textdomain: 'astra-import-export',
			},
			target: {
				files: {
					src: [ '*.php', '**/*.php', '!node_modules/**', '!php-tests/**', '!bin/**' ]
				}
			}
		},

		wp_readme_to_markdown: {
			your_target: {
				files: {
					'README.md': 'readme.txt'
				}
			},
		},

		makepot: {
			target: {
				options: {
					domainPath: '/languages',
					mainFile: 'astra-import-export.php',
					potFilename: 'astra-import-export.pot',
					potHeaders: {
						poedit: true,
						'x-poedit-keywordslist': true
					},
					type: 'wp-plugin',
					updateTimestamp: true
				}
			}
		},

				copy: {
		                main: {
		                    options: {
		                        mode: true
		                    },
		                    src: [
		                        '**',
		                        '*.zip',
		                        '!node_modules/**',
		                        '!build/**',
		                        '!css/sourcemap/**',
		                        '!.git/**',
		                        '!bin/**',
		                        '!.gitlab-ci.yml',
		                        '!bin/**',
		                        '!tests/**',
		                        '!phpunit.xml.dist',
		                        '!*.sh',
		                        '!*.map',
		                        '!Gruntfile.js',
		                        '!package.json',
		                        '!.gitignore',
		                        '!phpunit.xml',
		                        '!README.md',
		                        '!sass/**',
		                        '!codesniffer.ruleset.xml',
		                        '!vendor/**',
		                        '!composer.json',
		                        '!composer.lock',
		                        '!package-lock.json',
		                        '!phpcs.xml.dist',
		                    ],
		                    dest: 'astra-import-export/'
		                }
		        },

		        compress: {
		            main: {
		                options: {
		                    archive: 'astra-import-export-' + pkg.version + '.zip',
		                    mode: 'zip'
		                },
		                files: [
		                    {
		                        src: [
		                            './astra-import-export/**'
		                        ]

		                    }
		                ]
		            }
		        },

				clean: {
		            main: ["astra-import-export"],
		            zip: ["astra-import-export.zip"]

		        },

		        bumpup: {
		            options: {
		                updateProps: {
		                    pkg: 'package.json'
		                }
		            },
		            file: 'package.json'
		        },

		        replace: {
		            plugin_main: {
		                src: ['astra-import-export.php'],
		                overwrite: true,
		                replacements: [
		                    {
		                        from: /Version: \bv?(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)(?:-[\da-z-A-Z-]+(?:\.[\da-z-A-Z-]+)*)?(?:\+[\da-z-A-Z-]+(?:\.[\da-z-A-Z-]+)*)?\b/g,
		                        to: 'Version: <%= pkg.version %>'
		                    }
		                ]
		            },
		        }
	} );

	grunt.loadNpmTasks( 'grunt-wp-i18n' );
	grunt.loadNpmTasks( 'grunt-wp-readme-to-markdown' );
	grunt.registerTask( 'i18n', ['addtextdomain', 'makepot'] );
	grunt.registerTask( 'readme', ['wp_readme_to_markdown'] );
	grunt.loadNpmTasks( 'grunt-contrib-copy' );
    grunt.loadNpmTasks( 'grunt-contrib-compress' );
    grunt.loadNpmTasks( 'grunt-contrib-clean' );
    grunt.loadNpmTasks( 'grunt-bumpup' );
    grunt.loadNpmTasks( 'grunt-text-replace' );

	// Grunt release - Create installable package of the local files
    grunt.registerTask('release', ['clean:zip', 'copy', 'compress', 'clean:main']);

    // Bump Version - `grunt version-bump --ver=<version-number>`
    grunt.registerTask('version-bump', function (ver) {

        var newVersion = grunt.option('ver');

        if (newVersion) {
            newVersion = newVersion ? newVersion : 'patch';

            grunt.task.run('bumpup:' + newVersion);
            grunt.task.run('replace');
        }
    });

	grunt.util.linefeed = '\n';

};
