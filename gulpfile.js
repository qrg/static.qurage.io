'use strict';

const path = require('path');

const gulp = require('gulp');
const merge = require('merge-stream');
const sass = require('gulp-sass');
const uncss = require('gulp-uncss');
const cleanCss = require('gulp-clean-css');
const htmlmin = require('gulp-htmlmin');
const bs = require('browser-sync');

const paths = {
  src: './src',
  dest: './public'
};

const htmls = [
  `${paths.src}/index.html`,
  `${paths.src}/404.html`
];

const buildCss = () => {
  return gulp.src(`${paths.src}/sass/main.sass`)
    .pipe(sass().on('error', sass.logError))
    .pipe(uncss({
      html: htmls
    }))
    .pipe(cleanCss({debug: true}, (details) => {
      console.log(`${details.name}: ${details.stats.originalSize}`);
      console.log(`${details.name}: ${details.stats.minifiedSize}`);
    }))
    .pipe(gulp.dest(`${paths.dest}/assets/css`));
};
const buildHtml = () => {
  return gulp.src(`${paths.src}/*.html`)
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest(paths.dest));
};
const serve = () => {
  bs.init({
    server: {
      baseDir: paths.dest
    }
  });
  gulp.watch(`${paths.src}/sass/**/*.sass`, (e) => {
    return buildCss();
  });
  gulp.watch(`${paths.src}/*.html`, ['build']);

  gulp.watch(`${paths.dest}/**/*.css`).on('change', bs.reload);
  gulp.watch(`${paths.dest}/*.html`).on('change', bs.reload);
};

gulp.task('default', ['server']);
gulp.task('build', ['build:html'], (cb) => {
  return buildCss();
});
gulp.task('build:css', () => {
  return buildCss();
});
gulp.task('build:html', () => {
  return buildHtml();
});

gulp.task('server', ['build'], (cb) => {
  return serve();
});
