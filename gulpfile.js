'use strict';

var gulp = require('gulp');
var browserify = require('browserify');
var del = require('del');
var fs = require('fs');
var $ = require('gulp-load-plugins')();

gulp.task('jshint', function() {
  return gulp.src(['./src/**/*.js'])
    .pipe($.jshint('.jshintrc'))
    .pipe($.jshint.reporter('jshint-stylish'));
});

gulp.task('mocha', function() {
  return gulp.src('./tests/*.js', { read: false })
    .pipe($.mocha({
      recursive: true,
      compilers: require('6to5/register'),
      reporter: 'nyan',
    }));
});

gulp.task('test', ['jshint', 'mocha']);

gulp.task('bundle:node', ['test'], function() {
  del.sync(['./src-es5']);

  return gulp.src(['./src/**/*.js'])
    .pipe($['6to5']())
    .pipe(gulp.dest('./src-es5'));
});

gulp.task('bundle:browser:clean', function() {
  del.sync(['./dist']);
  fs.mkdirSync('./dist');
});

gulp.task('bundle:browser:bundle', ['test', 'bundle:browser:clean'], function() {
  return browserify({
    debug: false,
    standalone: 'Dictionary'
  })
    .transform(require('6to5ify'))
    .require('./src/dictionary.js', { entry: true })
    .bundle()
    .pipe(fs.createWriteStream('./dist/dictionary.dev.js'));
});

gulp.task('bundle:browser:minify', ['test', 'bundle:browser:clean', 'bundle:browser:bundle'], function() {
  return gulp.src('./dist/dictionary.dev.js')
    .pipe($.uglify({
      compress: {
        drop_console: true
      }
    }))
    .pipe($.rename('dictionary.prod.js'))
    .pipe(gulp.dest('./dist'));
});

gulp.task('bundle:browser', ['test', 'bundle:browser:clean', 'bundle:browser:bundle', 'bundle:browser:minify']);

gulp.task('default', ['bundle:node', 'bundle:browser']);
