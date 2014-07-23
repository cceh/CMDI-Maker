// include gulp
var gulp = require('gulp'); 
 
// include plug-ins
var jshint = require('gulp-jshint');
var changed = require('gulp-changed');
var imagemin = require('gulp-imagemin');
var minifyHTML = require('gulp-minify-html');
var concat = require('gulp-concat');
var stripDebug = require('gulp-strip-debug');
var uglify = require('gulp-uglify');
var minifyCSS = require('gulp-minify-css');
var htmlreplace = require('gulp-html-replace');
var header = require('gulp-header');

 
var source_scripts = [
/* Dependencies */
"./src/javascript/alertify.min.js",
"./src/javascript/FileSaver.js",
"./src/javascript/xml.js",
"./src/javascript/helpers.js",
"./src/javascript/dom.js",	
"./src/javascript/LanguageIndex.js",
	
	
/*Environments */
	/*IMDI */
	"./src/javascript/environments/imdi/imdi_environment.js",
	"./src/javascript/environments/imdi/imdi_LanguagePacks.js",
	"./src/javascript/environments/imdi/imdi_generator.js",
	"./src/javascript/environments/imdi/cmdi_generator.js",
	"./src/javascript/environments/imdi/imdi_forms.js",
	"./src/javascript/environments/imdi/imdi_corpus.js",
		"./src/javascript/environments/imdi/imdi_content_languages.js",
	"./src/javascript/environments/imdi/imdi_resources.js",
	"./src/javascript/environments/imdi/imdi_actors.js",
		"./src/javascript/environments/imdi/imdi_actor_languages.js",
	"./src/javascript/environments/imdi/imdi_sessions.js",
	"./src/javascript/environments/imdi/imdi_output.js",

	/*ELDP */
	"./src/javascript/environments/eldp/eldp_environment.js",
	"./src/javascript/environments/eldp/eldp_LanguagePacks.js",			
	"./src/javascript/environments/eldp/eldp_forms.js",
	"./src/javascript/environments/eldp/eldp_resources.js",
	"./src/javascript/environments/eldp/eldp_actors.js",
	"./src/javascript/environments/eldp/eldp_actor_languages.js",
	"./src/javascript/environments/eldp/eldp_sessions.js",
			
/*Core */
"./src/javascript/app.js",
"./src/javascript/LanguagePacks.js",
"./src/javascript/app.environments.js",
"./src/javascript/app.forms.js",
"./src/javascript/app.save_and_recall.js",
"./src/javascript/app.config.js"

];
 
 
// JS hint task
gulp.task('jshint', function() {
  gulp.src('./src/javascript/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});


// minify new images
gulp.task('imagemin', function() {
  var imgSrc = './src/img/**/*',
      imgDst = './build/img';
 
  gulp.src(imgSrc)
    .pipe(changed(imgDst))
    .pipe(imagemin())
    .pipe(gulp.dest(imgDst));
});



// minify new or changed HTML pages
gulp.task('htmlminify', function() {
  //var htmlSrc = './*.html';
  var htmlSrc = './build/*.html';
  //because we first replace script and style tags and then replace the file
  //at the build direction
  
  
  var htmlDst = './build';
 
  gulp.src(htmlSrc)
    .pipe(changed(htmlDst))
    .pipe(minifyHTML())
    .pipe(gulp.dest(htmlDst));
});





var header_text = '/*\n'+
'Copyright 2014 Sebastian Zimmer\n'+
'\n'+
'Licensed under the Apache License, Version 2.0 (the "License");\n'+
'you may not use this file except in compliance with the License.\n'+
'You may obtain a copy of the License at\n'+
'\n'+
'    http://www.apache.org/licenses/LICENSE-2.0\n'+
'\n'+
'Unless required by applicable law or agreed to in writing, software\n'+
'distributed under the License is distributed on an "AS IS" BASIS,\n'+
'WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n'+
'See the License for the specific language governing permissions and\n'+
'limitations under the License.\n'+
'*/\n';


// JS concat, strip debugging,minify, and add header
gulp.task('scripts', function() {
  gulp.src(source_scripts)
    .pipe(concat('script.js'))
    //.pipe(stripDebug())
    .pipe(uglify())
	.pipe(header(header_text))
    .pipe(gulp.dest('./build/scripts/'));
});


var style_sources = [
"./src/css/yaml.css",
"./src/css/layout.css",
"./src/css/typography.css",
"./src/css/layout-cmdi.css",
"./src/css/alertify.core.css",
"./src/css/alertify.default.css"
];


// CSS concat and minify
gulp.task('styles', function() {
  gulp.src(style_sources)
    .pipe(concat('styles.css'))
    .pipe(minifyCSS())
    .pipe(gulp.dest('./build/styles/'));
});

//Replace script tags in HTML
gulp.task('htmlreplace', function() {
  gulp.src('./src/index.html')
    .pipe(htmlreplace({
        'css': 'styles/styles.css',
        'js': 'scripts/script.js'
    }))
    .pipe(gulp.dest('./build/'));
});




// default gulp task
gulp.task('default', ['imagemin', 'htmlreplace', 'htmlminify', 'scripts', 'styles'], function() {
});


