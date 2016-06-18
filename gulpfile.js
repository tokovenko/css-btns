const gulp = require("gulp");
const isProdBuild = (require('./gulp/environment')).isProd;
const concat = require('gulp-concat');
const sass = require("gulp-sass");
const sourcemaps = require('gulp-sourcemaps');
const gulpif = require('gulp-if');
const browserSync = require('browser-sync').create();

gulp.task('sass', function() {
    return gulp.src([
            'sass/main.scss'
        ])
        .pipe(gulpif(!isProdBuild, sourcemaps.init()))
        .pipe(concat(isProdBuild ? 'css-btns.min.css' : 'css-btns.css'))
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(gulpif(!isProdBuild, sourcemaps.write('./')))
        .pipe(gulp.dest('dist/css'));
});

gulp.task('build', ['sass'], (isProdBuild ? null : function() {

    browserSync.init({
        proxy: "localhost:8080"
    });

    gulp.watch([
        `sass/**/*.scss`
    ], ['sass']);

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
