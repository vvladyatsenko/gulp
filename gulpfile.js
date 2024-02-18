const { src, dest, watch, task } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const browserSync = require('browser-sync').create();
const cssnano = require('cssnano');
const rename = require('gulp-rename');
const postcss = require('gulp-postcss');
const csscomb = require('gulp-csscomb');
const autoprefixer = require('autoprefixer');
const mqpacker = require('css-mqpacker');
const sortCSSmq = require('sort-css-media-queries');

const PLUGINS = [
  autoprefixer({
    overrideBrowserslist: ['last 5 versions'],
    cascade: true,
  }),
  mqpacker({ sort: sortCSSmq }),
];

const PATH = {
  scssRootFile: './assets/scss/style.scss',
  cssFolder: './assets/css',
  scssFolder: './assets/scss',
  scssAllFiles: './assets/scss/**/*.scss',
  htmlFolder: './',
  htmlAllFilesFolder: './*.html',
  jsFolder: './assets/js/',
  jsAllFilesFolder: './assets/js/**/*.js',
};

function scss() {
  return src(PATH.scssRootFile)
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss(PLUGINS))
    .pipe(dest(PATH.cssFolder))
    .pipe(browserSync.stream());
}

function scssDev() {
  return (
    src(PATH.scssRootFile, { sourcemaps: true })
      .pipe(sass().on('error', sass.logError))
      .pipe(dest(PATH.cssFolder, { sourcemaps: true }))
      .pipe(browserSync.stream())
  );
}

function scssMin() {
  const pluginsForMin = [...PLUGINS, cssnano({ preset: 'default' })];

  return src(PATH.scssRootFile)
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss(pluginsForMin))
    .pipe(rename({ suffix: '.min' }))
    .pipe(dest(PATH.cssFolder));
}

function comb() {
  return src(PATH.scssAllFiles).pipe(csscomb()).pipe(dest(PATH.scssFolder));
}

function syncInit() {
  browserSync.init({
    server: {
      baseDir: './',
    },
  });
}

async function sync() {
  browserSync.reload();
}

function watchFiles() {
  syncInit();
  watch(PATH.scssAllFiles, scss);
  watch(PATH.htmlAllFilesFolder, sync);
  watch(PATH.jsAllFilesFolder, sync);
}

task('dev', scssDev);
task('min', scssMin);
task('scss', scss);
task('comb', comb);
task('watch', watchFiles);
