'use strict';

var gulp = require('gulp');
var browserify = require('browserify');
var babelify = require('babelify');
var collapse = require('bundle-collapser/plugin');
var vinylSource = require('vinyl-source-stream');
var vinylBuffer = require('vinyl-buffer');
var del = require('del');
var fs = require('fs');
var $ = require('gulp-load-plugins')();


function bundleBrowserify(options) {
  var bundle =  browserify({
    debug: options.debug || false,
    standalone: 'Dictionary'
  })

  if (options.debug === false) {
    bundle.plugin(collapse);
  }

  return bundle.transform(babelify)
    .require('./src/dictionary.js', { entry: true })
    .bundle()
    .pipe(vinylSource('dictionary.js'))
    .pipe(vinylBuffer());
}


gulp.task('jshint', function() {
  return gulp.src(['./src/**/*.js'])
    .pipe($.jshint('.jshintrc'))
    .pipe($.jshint.reporter('jshint-stylish'));
});

gulp.task('mocha', function() {
  return gulp.src('./tests/*.js', { read: false })
    .pipe($.mocha({
      recursive: true,
      compilers: require('babel/register'),
      reporter: 'nyan',
    }));
});

gulp.task('test', ['jshint', 'mocha']);

gulp.task('bundle:node', ['test'], function() {
  del.sync(['./src-es5']);

  return gulp.src(['./src/**/*.js'])
    .pipe($.babel())
    .pipe(gulp.dest('./src-es5'));
});

gulp.task('bundle:browser:clean', function() {
  del.sync(['./dist']);
  fs.mkdirSync('./dist');
});

gulp.task('bundle:browser:bundle:dev', ['test', 'bundle:browser:clean'], function() {
  return bundleBrowserify({ debug: true })
    .pipe($.rename('dictionary-dev.js'))
    .pipe(gulp.dest('./dist'));
});

gulp.task('bundle:browser:bundle:prod', ['test', 'bundle:browser:clean'], function() {
  return bundleBrowserify({ debug: false })
    .pipe($.uglify({
      compress: {
        drop_console: true
      }
    }))
    .pipe($.rename('dictionary-prod.js'))
    .pipe(gulp.dest('./dist'));
});

gulp.task('bundle:browser', ['test', 'bundle:browser:clean', 'bundle:browser:bundle:dev', 'bundle:browser:bundle:prod']);

gulp.task('default', ['bundle:node', 'bundle:browser']);
