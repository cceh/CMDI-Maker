// include gulp
var gulp = require('gulp');

// include plug-ins
var jshint = require('gulp-jshint'),
      changed = require('gulp-changed'),
      imagemin = require('gulp-imagemin'),
      minifyHTML = require('gulp-minify-html'),
      concat = require('gulp-concat'),
      stripDebug = require('gulp-strip-debug'),
      uglify = require('gulp-uglify'),
      cleancss = require('gulp-clean-css'),
      htmlreplace = require('gulp-html-replace'),
      header = require('gulp-header'),
      manifest = require('gulp-manifest');
      connect = require('gulp-connect'),
      watch = require('gulp-watch'),
      notify = require('gulp-notify');

// For development localserver, livereload and watching changes on files
gulp.task('server', function() {
    connect.server({
        root: ['./src'],
        port: 8000,
        livereload: true
    });
});

gulp.task('livereload', function() {
    gulp.src([
        './src/*.html',
        './src/css/*.css',
        './src/js/*.js', 
        './src/img/*png', 
        './env/eldp/src/js/*js', 
        './env/imdi/src/js/*js', 
        './env/eldp/src/css/*.css', 
        './env/imdi/src/css/*.css'])
        .pipe(watch())
        .pipe(connect.reload())
        .pipe(notify({ message: 'livereload task complete' }));
});

gulp.task('watch', function() {
    gulp.watch([
        './src/*.html',
        './src/js/*.js',
        './src/css/*.css',
        './src/img/*png',
        './env/eldp/src/js/*.js',
        './env/eldp/src/css/*.css',
        './env/imdi/src/js/*.js',
        './env/imdi/src/css/*.css'
    ], function(event) {
        console.log('@--> caught change in file', event);
        gulp.src(event.path, { read: false })
            .pipe(connect.reload())
            .pipe(notify({ message: 'Caught change in CMDI Maker Core' }));
    });
});

// Here you can specify environment scripts which shall be included in the build/index.html as well as in the build/cmdi-maker.appcache
// !!! You are responsible for their real existence at their specified position !!!
// Main
/*
var environment_scripts = [
    "imdi_environment.js",
    "eldp_environment.js"
];

// Here you can specify environment stylesheets which shall be included in the build/index.html as well as in the build/mdi-maker.appcache
// !!! You are responsible for their real existence at their specified position !!!
var environment_stylesheets = [
    "imdi_environment.css",
    "eldp_environment.css"
];
*/

// beta
var environment_scripts = [
    "imdi_environment.js",
    "eldp_environment.js",
    "lido_environment.js" 
];


var environment_stylesheets = [
    "imdi_environment.css",
    "eldp_environment.css",
    "lido_environment.css" 
];


var environment_files = environment_scripts.concat(environment_stylesheets);


var make_appcache = true;


var source_scripts = [
    /* Dependencies */
    "./src/js/dates.js",
    "./src/js/helpers.js",
    "./src/js/alertify.js",
    "./src/js/zip.js",
    "./src/js/FileSaver.js",
    "./src/js/strings.js",
    "./src/js/XMLString.js",
    "./src/js/dom.js",
    "./src/js/ObjectList.js",

    //"./src/js/LanguageIndex.js",  //is loaded dynamically because of performance reasons

    /*Core */
    "./src/js/core/app.js",
    "./src/js/core/LanguagePacks.js",
    "./src/js/core/app.environments.js",
    "./src/js/core/app.forms.js",
    "./src/js/core/app.gui.js",
    "./src/js/core/app.gui.forms.js",
    "./src/js/core/app.gui.pager.js",
    "./src/js/core/app.save_and_recall.js",
    "./src/js/core/app.settings.js",
    "./src/js/core/app.config.js",
    "./src/js/core/app.internationalization.js"
];


var style_sources = [
    "./src/css/yaml.css",
    "./src/css/layout.css",
    "./src/css/typography.css",
    "./src/css/alertify.core.css",
    "./src/css/alertify.default.css"
];


// These scripts won't be built but just copied to the build.
var worker_and_dynamic_scripts = [
    "./src/js/deflate.js",
    "./src/js/inflate.js",
    "./src/js/LanguageIndex.js"
];


// Things to replace in the HTML file.
var html_replacements = {
    'css': 'styles/styles.css',
    'js': 'js/script.js',
    'environment_css': environment_stylesheets,
    'environment_js': environment_scripts
};


//manifest APP.cache
var manifest_cache_files = [
    "index.html",
    
    "styles/styles.css",
    
    "js/LanguageIndex.js",
    "js/deflate.js",
    "js/inflate.js",
    "js/script.js",
    
    "img/busy.svg",
    "img/favicon.ico",
    "img/logo-128.png",
    
    "img/logos/LOGO_BMBF.png",
    "img/logos/LOGO_CCeH.png",
    "img/logos/LOGO_CLARIN-D.png",
    "img/logos/LOGO_CLASS.png",
    "img/logos/LOGO_HRELP.png",
    "img/logos/LOGO_SOAS.png",
    "img/logos/LOGO_Uni_Koeln.png",
    
    "img/icons/about.png",
    "img/icons/addir.png",
    "img/icons/az.png",
    "img/icons/blocks.png",
    "img/icons/bookcase.png",
    "img/icons/box.png",
    "img/icons/bubble.png",
    "img/icons/chat.png",
    "img/icons/clock.png",
    "img/icons/cookie.png",
    "img/icons/copy.png",
    "img/icons/data.png",
    "img/icons/data2folder.png",
    "img/icons/down.png",
    "img/icons/download.png",
    "img/icons/duplicate_user.png",
    "img/icons/edit.png",
    "img/icons/export.png",
    "img/icons/flags.png",
    "img/icons/folder.png",
    "img/icons/gear.png",
    "img/icons/gear2.png",
    "img/icons/hamburger_menu.png",
    "img/icons/in_box.png",
    "img/icons/left.png",
    "img/icons/minus.png",
    "img/icons/network.png",
    "img/icons/open.png",
    "img/icons/pie_chart.png",
    "img/icons/play.png",
    "img/icons/plus.png",
    "img/icons/refresh.png",
    "img/icons/reset.png",
    "img/icons/right.png",
    "img/icons/right2.png",
    "img/icons/right3.png",
    "img/icons/save.png",
    "img/icons/search.png",
    "img/icons/shapes.png",
    "img/icons/star.png",
    "img/icons/stop.png",
    "img/icons/submit.png",
    "img/icons/text.png",
    "img/icons/textedit.png",
    "img/icons/trash.png",
    "img/icons/up.png",
    "img/icons/user.png",
    "img/icons/warning.png",
    "img/icons/wrench.png"
];


// Add environment files to manifest cache files
manifest_cache_files = manifest_cache_files.concat(environment_files);


// TASKS
// JS hint task
gulp.task('jshint', function() {
    gulp.src('./src/js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(notify({ message: 'JSHINT task complete' }));
});


// minify new images
gulp.task('imagemin', function() {
    var imgSrc = './src/img/**/*',
        imgDst = './build/img';

    gulp.src(imgSrc)
        //.pipe(changed(imgDst))
        .pipe(imagemin())
        .pipe(gulp.dest(imgDst));
});


// minify new or changed HTML pages
gulp.task('htmlminify', function() {
    var htmlSrc = './src/index.html';
    var htmlDst = './build';
    gulp.src(htmlSrc)
        //.pipe(changed(htmlDst))
        .pipe(htmlreplace(html_replacements))
        .pipe(minifyHTML())
        .pipe(gulp.dest(htmlDst))
        .pipe(notify({ message: 'HTML minify task complete' }));
});


// JS concat, strip debugging, minify, and add header
gulp.task('scripts', function() {

    gulp.src(source_scripts)
        .pipe(concat('script.js')).on('error', errorHandler)
        //.pipe(stripDebug())
        .pipe(uglify()).on('error', errorHandler)
        .pipe(gulp.dest('./build/js/')).on('error', errorHandler)
        .pipe(notify({ message: 'Scripts task complete' }));

});


gulp.task('script-workers', function() {
    gulp.src(worker_and_dynamic_scripts)
        .pipe(gulp.dest('./build/js/'))
        .pipe(notify({ message: 'Script workers task complete' }));

});


// CSS concat and minify
gulp.task('styles', function() {
    gulp.src(style_sources)
        .pipe(concat('styles.css'))
        .pipe(cleancss())
        .pipe(gulp.dest('./build/styles/'))
        .pipe(notify({ message: 'Styles task complete' }));
});

// app cache
gulp.task('manifest', function(){
    gulp.src([])
        .pipe(manifest({
            hash: true,
            filename: 'cmdi-maker.appcache',
            network: ["*"],  //important, so that network stuff like version checker works
            exclude: [],
            cache: manifest_cache_files
        }))
        .pipe(gulp.dest('build'))
        .pipe(notify({message: 'Manifest task complete'}));
});


// execute default gulp task
var tasks = ['imagemin', 'htmlminify', 'scripts', 'script-workers', 'styles'];
gulp.task('default', tasks, function() {});

if (make_appcache){
    tasks.push('manifest');
}


// testing build
gulp.task('test-server', ['server', 'watch'], function() {});


// Error handler
function errorHandler(error) {
    console.log(error.toString());
    this.emit('end');
}

/*
 because of warning "Possible EventEmitter memry leak detected
 now without warning messages
 */
require('events').EventEmitter.prototype._maxListeners = 100;