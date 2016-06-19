const gulp = require("gulp");
const isProdBuild = (require('./gulp/environment')).isProd;
const concat = require('gulp-concat');
const sass = require("gulp-sass");
const sourcemaps = require('gulp-sourcemaps');
const gulpif = require('gulp-if');
const browserSync = require('browser-sync').create();

function buildSass(src, concatTo) {
    return function() {
        return gulp.src(src)
            .pipe(gulpif(!isProdBuild, sourcemaps.init()))
            .pipe(concat(concatTo))
            .pipe(sass(isProdBuild ? {outputStyle: 'compressed'} : {})
                    .on('error', sass.logError))
            .pipe(gulpif(!isProdBuild, sourcemaps.write('./')))
            .pipe(gulp.dest('dist/css'));
    };
}

gulp.task('sass-btns', buildSass('sass/btns.scss', (isProdBuild ? 'css-btns.min.css' : 'css-btns.css')));
gulp.task('sass-main', buildSass('sass/main.scss', (isProdBuild ? 'main.min.css' : 'main.css')));

gulp.task('build', ['sass-btns', 'sass-main'], (isProdBuild ? null : function() {

    browserSync.init({
        proxy: "localhost:8080"
    });

    gulp.watch([
        `sass/**/*.scss`
    ], ['sass-btns', 'sass-main']);

    gulp.watch('dist/css/**/*.css', function() {
        gulp.src('dist/css/**/*.css')
            .pipe(browserSync.stream());
    });

}));

gulp.doneCallback = function(err) {
    if(isProdBuild) {
        process.exit(err ? 1 : 0);
    }
};
