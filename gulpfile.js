var gulp = require('gulp');
var imagemin = require('gulp-imagemin');
var purify = require('gulp-purifycss');
var cleanCSS = require('gulp-clean-css');
var webp = require('gulp-webp');
var responsive = require('gulp-responsive');
var cssbeautify = require('gulp-cssbeautify');
var workboxBuild = require('workbox-build');
var removeHtmlComments = require('gulp-remove-html-comments');
var htmlmin = require('gulp-html-minifier');

gulp.task('service-worker', () => {
  return workboxBuild.generateSW({
    globDirectory: 'public',
    globPatterns: [
      '**\/*.{html,json,js,css,jpg,png,jpeg,svg,gif,mp4,ico,woff,tff}',
    ],
    swDest: 'build/sw.js',
  });
});

gulp.task('service-worker-mp4', () => {
  return workboxBuild.generateSW({
    globDirectory: 'public',
    globPatterns: [
      'sites/default/files/*.mp4',
    ],
    swDest: 'build/sw.js',
  });
});

gulp.task('striphtml', function () {
  return gulp.src('public/index.html')
    .pipe(removeHtmlComments())
    .pipe(gulp.dest('index'));
});

gulp.task('minifyhtml', function () {
  gulp.src('index/index.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('dist'))
});

gulp.task('beautifycss', function () {
  return gulp.src('public/_resources/css/styles.css')
    .pipe(cssbeautify())
    .pipe(gulp.dest('beautify'));
});

var cssmin = require('gulp-cssmin');
var rename = require('gulp-rename');
gulp.task('minifycss', function () {
  gulp.src('public/_resources/css/styles.css')
    .pipe(cssmin())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('minifiedcss'));
});

const stripCssComments = require('gulp-strip-css-comments');
gulp.task('strip-comments', () =>
  gulp.src('public/_resources/css/styles.css')
    .pipe(stripCssComments())
    .pipe(gulp.dest('dist'))
);

var stripjs = require('gulp-strip-comments');
gulp.task('stripjs', function () {
  return gulp.src('public/_resources/js/myscripts.js')
    .pipe(stripjs())
    .pipe(gulp.dest('dist'));
});

const minify = require('gulp-minify');
gulp.task('minifyjs', function () {
  gulp.src('myscripts.js')
    .pipe(minify({
      ext: {
        src: '-debug.js',
        min: '.js'
      },
      exclude: ['tasks'],
      ignoreFiles: ['.combo.js', '-min.js']
    }))
    .pipe(gulp.dest('dist'))
});


gulp.task('styles', function () {
  console.log('run styles');
});

// Compress images
gulp.task('image', function () {
  gulp.src('public/_resources/vid/vid-poster.webp')
    .pipe(imagemin([
      imagemin.gifsicle({ interlaced: true }),
      imagemin.jpegtran({ progressive: true }),
      imagemin.optipng({ optimizationLevel: 5 }),
      imagemin.svgo({
        plugins: [
          { removeViewBox: true },
          { cleanupIDs: false }
        ]
      })
    ]))
    .pipe(gulp.dest('asdfj'));
});

// Convert jpg to webp
gulp.task('webp', () =>
  gulp.src('public/_resources/img/placeholder_ig-50w.jpg')
    .pipe(webp())
    .pipe(gulp.dest('webp'))
);

gulp.task('purifycss', function () {
  return gulp.src('styles.css')
    .pipe(purify(['public/_resources/js/*.js', 'index.html']))
    .pipe(gulp.dest('purified'));
});

gulp.task('minify-css', () => {
  return gulp.src('public/_resources/css/styles.css')
    .pipe(cleanCSS({ compatibility: 'ie8' }))
    .pipe(gulp.dest('minifiedcss'));
});


// Generate images at different sizes
gulp.task('responsive', function () {
  return gulp.src('public/_resources/img/logo_UCSD_white.png')
    .pipe(responsive({
      // Resize all JPG images to three different sizes: 200, 400, and 500 pixels
      '*.jpg': [{
        width: 50,
        rename: { suffix: '-50w' },
      }, {
        width: 400,
        rename: { suffix: '-400w' },
      }, {
        width: 500,
        rename: { suffix: '-500w' },
      }, {
        // Compress, strip metadata, and rename original image
        rename: { suffix: '-original' },
      }],

      '*.webp': [{
        width: 50,
        rename: { suffix: '-50w' },
      }, {
        width: 400,
        rename: { suffix: '-400w' },
      }, {
        width: 500,
        rename: { suffix: '-500w' },
      }, {
        // Compress, strip metadata, and rename original image
        rename: { suffix: '-original' },
      }],

      '*.png': [{
        width: 50,
        rename: { suffix: '-50w' },
      }, {
        width: 400,
        rename: { suffix: '-400w' },
      }, {
        width: 500,
        rename: { suffix: '-500w' },
      }, {
        // Compress, strip metadata, and rename original image
        rename: { suffix: '-original' },
      }],
    }, {
        // Global configuration for all images
        // The output quality for JPEG, WebP and TIFF output formats
        quality: 70,
        // Use progressive (interlace) scan for JPEG and PNG output
        progressive: true,
        // Strip all metadata
        withMetadata: false,
        errorOnEnlargement: false,
      }))
    .pipe(gulp.dest('temp'));
});

// Generate images at different sizes
gulp.task('responsiveJPG', function () {
  return gulp.src('public/_images/about/*.jpg')
    .pipe(responsive({
      // Resize all JPG images to three different sizes: 200, 400, and 500 pixels
      '*.jpg': [{
        width: 75,
        rename: { suffix: '-tiny' },
      }, {
        // Compress, strip metadata, and rename original image
        rename: { suffix: '-original' },
      }],
    }, {
        // Global configuration for all images
        // The output quality for JPEG, WebP and TIFF output formats
        quality: 70,
        // Use progressive (interlace) scan for JPEG and PNG output
        progressive: true,
        // Strip all metadata
        withMetadata: false,
        errorOnEnlargement: false,
      }))
    .pipe(gulp.dest('temp'));
});

// gulp.task('default', ['scripts', 'styles']);