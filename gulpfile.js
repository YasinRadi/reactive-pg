const spawn = require('child_process').spawn
const gulp  = require('gulp')
const maps  = require('gulp-sourcemaps')
const babel = require('gulp-babel')
const css   = require('gulp-css')
const path  = require('path')
const del   = require('del')
const dest = 'dist'

/* Build */

gulp.task('build-ts', () => {
  return gulp.src('src/**/*.{ts,tsx}')
    .pipe(maps.init())
    .pipe(babel())
    .pipe(maps.write('.'))
    .pipe(gulp.dest(`${dest}`))
})

gulp.task('build-css', () => {
  return gulp.src('src/**/*.css', '!src/css/*.min.css')
    .pipe(css())
    .pipe(gulp.dest(`${dest}`))
}) 

gulp.task('build-js', () => {
  return gulp.src('src/**/*.js', '!src/**/*.test.js')
    .pipe(maps.init())
    .pipe(babel())
    .pipe(maps.write('.'))
    .pipe(gulp.dest(`${dest}`))
})


gulp.task('build', gulp.series('build-ts', 'build-js'))


/* Copy */

gulp.task('copy-html', () => {
  return gulp.src('src/*.html')
    .pipe(gulp.dest(dest))
})

gulp.task('copy-min-css', () => {
  return gulp.src('src/css/*.css')
    .pipe(gulp.dest(`${dest}/css`))
})

gulp.task('copy', gulp.parallel(
    'copy-html', 
    'copy-min-css'
  )
)

gulp.task('clean', () => {
  return del('dist/**', { force: true })
})

/* Execute */

const cmd   = (name) => path.join('.', 'node_modules', '.bin', name)
const args  = (more) => Array.isArray(more) ? ['.'].concat(more) : ['.']
const exit  = () => process.exit()

gulp.task('start', gulp.series('clean', 'copy', 'build', async () => {
  spawn(cmd('electron'), args(), { stdio: 'inherit', cwd: '.', shell: true }).on('close', exit)
}))


gulp.task('release', gulp.series('copy', 'build', () => {
  spawn(cmd('electron-builder'), args(), { stdio: 'inherit', cwd: '.', shell: true }).on('close', exit)
}))

gulp.task('test', gulp.series('copy', 'build', () => {
  spawn(cmd('jest'), args(), { stdio: 'inherit', cwd: '.', shell: true }).on('close', exit)
}))


