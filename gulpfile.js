'use strict';

const gulp = require('gulp');

const concat = require('gulp-concat');
// const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const maps = require('gulp-sourcemaps');
const del = require('del');

const browserSync = require('browser-sync').create();
const reload = browserSync.reload();


// Clean operation
gulp.task('clean', () =>{
  // Globbing patterns account for .min and .map
  del(['css/*.css*']);
  // del(['src/css']);
})


// Compile Sass task
gulp.task('compileSass', () => {
  return gulp.src('src/scss/application.scss')
  .pipe(maps.init())
  .pipe(sass())
  .pipe(concat('app.css'))
  .pipe(maps.write('.')) // Relative to output directory below
  .pipe(gulp.dest('css'));
});


// Concatinate SCSS
gulp.task('concatCss', () => {
  return gulp.src([
    'node_modules/reset-css/reset.css',
    'node_modules/bootstrap/dist/css/bootstrap.css'
    // 'bower_components/bootstrap/less/bootstrap.less',
  ])
  .pipe(maps.init())
  .pipe(concat('libs.css'))
  .pipe(maps.write('.'))
  .pipe(gulp.dest('css'))
});


// Concatinate JS
gulp.task('concatJs', () => {
  return gulp.src([
    // Bootstrap template (cluster) js files
    // 'src/js/src/jquery.min.js',
    // 'src/js/src/bootstrap.min.js',

    // My js
    'src/js/myscripts.js',
  ])
  .pipe(maps.init())
  .pipe(concat('app.js'))
  .pipe(maps.write('.'))
  .pipe(gulp.dest('js'))
});


// // Minify scripts
// gulp.task('minifyScripts', ['concatScripts'], () => {
//   return gulp.src('js/app.js')
//   .pipe(uglify())
//   .pipe(rename('app.min.js'))
//   .pipe(gulp.dest('js'));
// });

// just reload
gulp.task('reload', () => {
  browserSync.reload();
})

// Concat scss and reload
gulp.task('sassReload', ['compileSass'], (done) => {
  browserSync.reload();
  done();
})


// Concat js and reload
gulp.task('jsReload', ['concatJs'], (done) => {
  browserSync.reload();
  done();
})


// Watch task
gulp.task('watchFiles', () => {
  gulp.watch(['src/scss/**/*.scss'], ['sassReload']);
  // gulp.watch(['src/js/**/*.js'], ['jsReload']);
  gulp.watch(['./*.html'], ['reload']);
})


// Default task
gulp.task('default', ['clean'], () => {
  // gulp.start('concatJs');
  gulp.start('compileSass');
  gulp.start('concatCss');
  gulp.start('watchFiles', ['compileSass']);
  browserSync.init({
      server: {
          baseDir: "./"
      },
      notify: false
  });
});
