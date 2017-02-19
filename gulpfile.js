var gulp = require("gulp");

// var ts=function(){
//     var x=this;
//     x.ts=require("gulp-typescript");
//     x.src="js/**/*.ts";
//     x.proyect=x.ts.createProject("tsconfig.json");
// }
var ts = {
    ts:require("gulp-typescript"),
    src:"js/**/*.ts"
}

ts.proyect=ts.ts.createProject("tsconfig.json");

var sourcemaps = require('gulp-sourcemaps');
var watch = require('gulp-watch');
var concat = require('gulp-concat');
var runSequence = require('run-sequence');
var minify = require('gulp-minify');
var uglify = require('gulp-uglify');
var pump = require('pump');
var obfuscate = require('gulp-obfuscate');

gulp.task('ts-sourcemaps', function() {
    var tsResult = gulp.src(ts.src)
        .pipe(sourcemaps.init()) // This means sourcemaps will be generated
        .pipe(ts.ts({

        }));

    return tsResult.js
    //    .pipe( ... ) // You can use other plugins that also support gulp-sourcemaps
    .pipe(sourcemaps.write(".")) // Now the sourcemaps are added to the .js file
        .pipe(gulp.dest('js'));
});

gulp.task('concat', function() {
    return gulp.src([
        'js/references.js',
        'js/app.js',
        'js/dom.js',
        'js/components/*.js',
        'js/common/*.js',
        'js/controllers/*.js'
    ])
        .pipe(concat('main.js')).js
        .pipe(gulp.dest('js'));
});

gulp.task('minify', function() {
    return gulp.src('js/main.js')
        .pipe(minify({
            ext:{

                min:'.min.js'
            }
        }))
        .pipe(gulp.dest('js'));
});

gulp.task('uglify', function (cb) {
    pump([
            gulp.src('js/main.min.js'),
            uglify(),
            gulp.dest('dist')
        ],
        cb
    );
});

gulp.task('obfuscate', function () {
    return gulp.src('dist/main.min.js')
        .pipe(obfuscate());
});


gulp.task('watch', ['ts-sourcemaps'], function() {
    gulp.watch(ts.src, ['ts-sourcemaps']);
});

gulp.task('default', function (cb) {
    //runSequence('ts', 'concat','minify','uglify','obfuscate', cb);
});