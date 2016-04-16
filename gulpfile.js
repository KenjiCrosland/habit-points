var gulp = require('gulp');
var webpack = require('webpack-stream');

gulp.task('static:dev', function(){
	gulp.src('app/**/*.html')
	.pipe(gulp.dest('build/'));
});

gulp.task('webpack:dev', function(){
	gulp.src('./app/js/main.js')
	.pipe(webpack({
		output: {
			filename: 'bundle.js'
		}
	}))
	.pipe(gulp.dest('build/'))
});

gulp.task('build:dev', ['webpack:dev', 'static:dev']);