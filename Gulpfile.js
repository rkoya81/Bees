var gulp = require('gulp');
var sass = require('gulp-sass');
var minifyCSS = require('gulp-minify-css');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var browserSync = require('browser-sync').create();
var Server = require('karma').Server;
var jasmine = require('gulp-jasmine');

/*
  Config for JS file paths
*/

var config = {
  angsrc: [
    'node_modules/angular/angular.js',
    'node_modules/angular-route/angular-route.min.js'
  ],
  scriptsrc: [
    'node_modules/underscore/underscore-min.js',
    'javascript/dev/script.js'
  ]
}

/*
  Browser reloading task
*/
gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: ''
    },
  })
})

/*
  Task to covert sass files to css
*/
gulp.task('sass', function(){
  return gulp.src('scss/**/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('css/dev'))
});

/*
  Task to concat and minify css
*/
gulp.task('minifyConcatCSS', ['sass'], function(){
  return gulp.src('css/dev/*.css')
    .pipe(concat('style.min.css'))
    .pipe(minifyCSS())
    .pipe(gulp.dest('css/min'))
});

/*
  Task to concat and minify angular files
*/
gulp.task('bundle-angular', function() {
  return gulp.src(config.angsrc)
  .pipe(concat('angular.min.js'))
  .pipe(uglify())
  .pipe(gulp.dest('javascript/min'))
});

/*
  Task to concat and minify js script
*/
gulp.task('bundle-script', function() {
  return gulp.src(config.scriptsrc)
  .pipe(concat('script.min.js'))
  .pipe(gulp.dest('javascript/min'))
});


gulp.task('tests', function(done) {
 var server =  new Server({
    configFile: __dirname + '/karma.conf.js',
    singleRun: false
  });

  server.on('browser_error', function (browser, err){
    throw err;
  });

  server.on('run_complete', function (browsers, results){
    if (results.failed) {
        throw new Error('Karma: Tests Failed');
    }
    done();
  });

  server.start();
});

/*
  Task to watch for changes
*/
gulp.task('watch', ['browserSync','sass','minifyConcatCSS','bundle-angular','bundle-script'], function(){
  gulp.watch('scss/**/*.scss', ['sass']); 
  gulp.watch('css/dev/*.css', ['minifyConcatCSS']);
  gulp.watch('javascript/dev/*.js', ['bundle-script']);
  gulp.watch('*.html', browserSync.reload); 
  gulp.watch('pages/**/*.html', browserSync.reload); 
  gulp.watch('javascript/dev/*.js', browserSync.reload); 
  gulp.watch('css/dev/*.css', browserSync.reload);  

});

gulp.task('default', ['watch','tests']);