'use strict';

var gulp = require('gulp');
var jquery = require('gulp-jquery');
var watch = require('gulp-watch');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var stylus = require('gulp-stylus');
var csso = require('gulp-csso');
var concat = require('gulp-concat');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var stylint = require('gulp-stylint');

var path = {
  build: {
    html: 'build/',
    js: 'build/js',
    style: 'build/css',
    fonts: 'build/fonts',
    img: 'build/images'
  },
  src: {
    html: 'src/*.html',
    js: 'src/js/*.js',
    style: 'src/main.styl',
    fonts: 'src/fonts/**/*.*',
    img: 'src/images/**/*'
  },
  watch: {
    html: 'src/**/*.html',
    js: 'src/js/**/*.js',
    style: 'src/**/*.styl',
    fonts: 'src/fonts/**/*.*',
    img: 'src/images/**/*'
  }  
};

var config = {
  server: {
    baseDir: './build'
  },
  host: 'localhost',
  port: 8000,
  logPrefix: 'pronoun'
};

gulp.task('webserver', function() {
  browserSync(config);
});

gulp.task('styluslint', function () {
  return gulp.src('src/**/*.styl')
    .pipe(stylint({config: '.stylintrc'}))
    .pipe(stylint.reporter());
});

gulp.task('html:build', function() {
  gulp.src(path.src.html)
    .pipe(gulp.dest(path.build.html))
    .pipe(reload({
      stream: true
    }));
});

gulp.task('js:build', function() {
  return gulp.src(path.src.js)
    .pipe(gulp.dest(path.build.js))
    .pipe(reload({
      stream: true
    }));
});

gulp.task('jquery:build', function () {
  return gulp.src('./node_modules/jquery/src')
    .pipe(jquery({
        flags: ['-deprecated', '-event/alias', '-ajax/script', '-ajax/jsonp', '-exports/global']
    }))
    .pipe(gulp.dest(path.build.js));
});

gulp.task('style:build', function() {
  return gulp.src(path.src.style)
    .pipe(stylus({
      'include css': true
    }))
    .pipe(csso())
    .pipe(postcss([ autoprefixer({ browsers: ['last 2 versions'] }) ]))
    .pipe(gulp.dest(path.build.style))
    .pipe(reload({
      stream: true
    }));
});

gulp.task('fonts:build', function() {
  return gulp.src(path.src.fonts)
    .pipe(gulp.dest(path.build.fonts))
    .pipe(reload({
      stream: true
    }));
});

gulp.task('image:build', function() {
  return gulp.src(path.src.img)
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{
        removeViewBox: false
      }],
      use: [pngquant()],
      interlaced: true
    }))
    .pipe(gulp.dest(path.build.img))
    .pipe(reload({
      stream: true
    }));
});

gulp.task('build', [
  'html:build',
  'js:build',
  'jquery:build',
  'style:build',
  'fonts:build',
  'image:build'
]);

gulp.task('watch', function() {
  watch([path.watch.html], function(event, cb) {
    gulp.start('html:build');
  });
  watch([path.watch.style], function(event, cb) {
    gulp.start('style:build');
  });
  watch([path.watch.img], function(event, cb) {
    gulp.start('image:build');
  });
  watch([path.watch.fonts], function(event, cb) {
    gulp.start('fonts:build');
  });
  watch([path.watch.js], function(event, cb) {
    gulp.start('js:build');
  });
});

gulp.task('default', ['build', 'webserver', 'watch']);
gulp.task('lint', ['styluslint']);
