var gulp = require('gulp');
var webpack = require('webpack-stream');

gulp.task('static:dev', function(){
	gulp.src('app/**/*.html')
	.pipe(gulp.dest('build/'));
});

gulp.task('webpack:dev', function(){
	gulp.src('./app/js/main.js')
	.pipe(webpack(require('./webpack.config.js')))
	.pipe(gulp.dest('build/'))
});

gulp.task('watch', function(){
	gulp.watch('./app/js/**/*.js', ['build:dev']);
	gulp.watch('app/**/*.html', ['static:dev']);
});
gulp.task('build:dev', ['webpack:dev', 'static:dev']);