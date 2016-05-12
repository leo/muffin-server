const gulp = require('gulp')
const babel = require('gulp-babel')
const cache = require('gulp-cached')

const paths = [
  'lib/**/*',
]

gulp.task('transpile', () => {
  return gulp.src(paths)
  .pipe(cache('transpile'))
  .pipe(babel())
  .pipe(gulp.dest('dist'))
})

gulp.task('default', () => gulp.watch(paths, ['transpile']))
