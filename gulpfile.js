const gulp = require('gulp');
const zip = require('gulp-zip');

const chrome = require('./chrome/manifest');
const copyFilesSrc = ['./itunes-artwork-grabber.user.js'];
const copyFilesDesc = './chrome/scripts/';
const zipFilesSrc = './chrome/**/*';
const zipFilesDesc = './dist/';

function copyFiles() {
  return gulp.src(copyFilesSrc)
    .pipe(gulp.dest(copyFilesDesc));
}

function zipFiles() {
  return gulp.src(zipFilesSrc)
    .pipe(zip('chrome-extension-' + chrome.version + '.zip'))
    .pipe(gulp.dest(zipFilesDesc));
}

function watchFiles() {
  return gulp.watch(copyFilesSrc, function(cb) {
    copy();
    cb();
  });
}

exports.serve = gulp.series(watchFiles);
exports.default = gulp.series(copyFiles, zipFiles);
