var gulp      = require('gulp');
var eslint    = require('gulp-eslint');

var paths = {
  js: [
        './bin/*.js',
        './bin/**/*.js',
        './lib/*.js',
        './lib/**/*.js',
        '!node_modules/**'
      ]
};

gulp.task('default', ['lint']);

gulp.task('watch', function() {
  gulp.watch(paths.js, ['lint']);
});

gulp.task('lint', function () {
  // ESLint ignores files with "node_modules" paths.
  // So, it's best to have gulp ignore the directory as well.
  // Also, Be sure to return the stream from the task;
  // Otherwise, the task may end before the stream has finished.
  return gulp.src(paths.js)
    // eslint() attaches the lint output to the "eslint" property
    // of the file object so it can be used by other modules.
    .pipe(eslint())
    // eslint.format() outputs the lint results to the console.
    // Alternatively use eslint.formatEach() (see Docs).
    .pipe(eslint.format())
    // To have the process exit with an error code (1) on
    // lint error, return the stream and pipe to failAfterError last.
    .pipe(eslint.failAfterError())

    // If eslint.format() is not working, uncomment below:
    // .pipe(eslint.results(function (results) {

    //     results.forEach(function(result){

    //         if(result.messages.length > 0){
    //             log.info(result.filePath);
    //             result.messages.forEach(function(message){
    //                 log.warn('Line:' + message.line + ' Col:' + message.column + ' : ' +message.message);
    //             });
    //         }

    //     });

        // // Called once for all ESLint results.
        // console.log('\nTotal Results: ' + results.length);
        // console.log('Total Warnings: ' + results.warningCount);
        // console.log('Total Errors: ' + results.errorCount);
    // }));
});
