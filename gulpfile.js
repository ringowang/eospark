console.log('处理编译后的文件');
var gulp = require('gulp');
var replace = require('gulp-replace');
var timestamp=new Date().getTime();

gulp.task('one', function(){
  gulp.src('./dist/index.html')
    .pipe(replace('./index.js', '/index.js?t='+timestamp))
    .pipe(replace('./index.css', '/index.css?t='+timestamp))
    .pipe(gulp.dest('./dist'));
});

gulp.task('two', function(){
  gulp.src('./dist/index.js')
    .pipe(replace('s.src=t.p+""+({}[e]||e)+".async.js";', 's.src="/"+t.p+""+({}[e]||e)+".async.js";'))
    .pipe(gulp.dest('./dist'));
});

gulp.task('default', ['one', 'two']);