const gulp = require('gulp');
const zip = require('gulp-zip');

var version = require('./package').version;
var chrome = require('./chrome/manifest');
var src = './itunes-artwork-grabber.user.js';

gulp.task('serve', function() {
  var watcher = gulp.watch(src, ['copy']);
});

gulp.task('copy', function() {
  gulp.src(src)
  .pipe(gulp.dest('./chrome/scripts/'));
});

gulp.task('default', ['copy'], function() {
  gulp.src('./chrome/**/*')
  .pipe(zip('chrome-extension-' + chrome.version + '.zip'))
  .pipe(gulp.dest('./dist/'));
});
