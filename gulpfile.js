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
var manifest = require('gulp-manifest');
//var imageResize = require('gulp-image-resize');


var source_scripts = [
/* Dependencies */
"./src/js/alertify.js",
"./src/js/zip.js",
"./src/js/FileSaver.js",
"./src/js/xml.js",
"./src/js/helpers.js",
"./src/js/dom.js",
"./src/js/ObjectList.js",
//"./src/js/LanguageIndex.js",  //is loaded dynamically


/*Core */
"./src/js/core/app.js",
"./src/js/core/LanguagePacks.js",
"./src/js/core/app.environments.js",
"./src/js/core/app.forms.js",
"./src/js/core/app.gui.js",
"./src/js/core/app.gui.forms.js",
"./src/js/core/app.save_and_recall.js",
"./src/js/core/app.settings.js",
"./src/js/core/app.config.js",

	
/* Environments */
	/* IMDI */
	"./src/js/environments/imdi/imdi_environment.js",
	"./src/js/environments/imdi/imdi_LanguagePacks.js",
	"./src/js/environments/imdi/imdi_generator.js",
	"./src/js/environments/imdi/cmdi_generator.js",
	"./src/js/environments/imdi/imdi_forms.js",
	"./src/js/environments/imdi/imdi_corpus.js",
		"./src/js/environments/imdi/imdi_content_languages.js",
	"./src/js/environments/imdi/imdi_resources.js",
	"./src/js/environments/imdi/imdi_actors.js",
		"./src/js/environments/imdi/imdi_actor_languages.js",
	"./src/js/environments/imdi/imdi_sessions.js",
	"./src/js/environments/imdi/imdi_output.js",
	

	/*ELDP */
	"./src/js/environments/eldp/eldp_environment.js",
	"./src/js/environments/eldp/eldp_LanguagePacks.js",			
	"./src/js/environments/eldp/eldp_forms.js",
	"./src/js/environments/eldp/eldp_resources.js",
	"./src/js/environments/eldp/eldp_actors.js",
	"./src/js/environments/eldp/eldp_actor_languages.js",
	"./src/js/environments/eldp/eldp_sessions.js",
		"./src/js/environments/eldp/eldp_sessions_rendering.js",
	"./src/js/environments/eldp/eldp_output.js",
	"./src/js/environments/eldp/eldp_generator.js",




];
 
 
// JS hint task
gulp.task('jshint', function() {
  gulp.src('./src/js/*.js')
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
  var htmlSrc = './src/index.html';
  //because we first replace script and style tags and then replace the file
  //at the build direction
  
  
  var htmlDst = './build';
 
  gulp.src(htmlSrc)
    .pipe(changed(htmlDst))
    .pipe(htmlreplace({
        'css': 'styles/styles.css',
        'js': 'js/script.js'
    }))
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


// JS concat, strip debugging, minify, and add header
gulp.task('scripts', function() {
  gulp.src(source_scripts)
    .pipe(concat('script.js'))
    //.pipe(stripDebug())
    .pipe(uglify())
	.pipe(header(header_text))
    .pipe(gulp.dest('./build/js/'));
});


var worker_and_dynamic_scripts = [
	"./src/js/deflate.js",
	"./src/js/inflate.js",
	"./src/js/LanguageIndex.js"
];


gulp.task('script-workers', function() {
  gulp.src(worker_and_dynamic_scripts)
    .pipe(gulp.dest('./build/js/'));
});


var style_sources = [
"./src/css/yaml.css",
"./src/css/layout.css",
"./src/css/typography.css",
"./src/css/layout-eldp.css",
"./src/css/layout-imdi.css",
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


gulp.task('manifest', function(){
  gulp.src(['build/**/*'])
    .pipe(manifest({
      hash: true,
      filename: 'cmdi_maker.appcache',
	  network: ["*"],  //important, so that network stuff like version checker works
      exclude: ['cmdi_maker.appcache', 'img/logos/Thumbs.db']
     }))
    .pipe(gulp.dest('build'));
});


/* Don't use ImageMagick because it has a bug that makes some PNGs transparent. GraphicsMagick is in this case better. */
/* But we don't do image resizing at all at this point. */
/*
gulp.task('resize', function () {
  gulp.src(['src/img/icons/*'])
    .pipe(imageResize({ 
      width : 36,
      height : 36,
      upscale : false,
	  imageMagick: false
    }))
    .pipe(gulp.dest('build/img/icons/'));
});
*/


// default gulp task
gulp.task('default', ['imagemin', 'htmlminify', 'scripts', 'script-workers', 'styles', 'manifest'], function() {});


