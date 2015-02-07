var gulp = require('gulp');
var shell = require('gulp-shell');

// Copy the config replacement for the gtfs module
gulp.task('copy_config', function(){
	gulp.src('./config/*.js')
	  .pipe(gulp.dest('./node_modules/gtfs/'));
});

// Run task to download the agency data
gulp.task('download_gtfs', ['copy_config'], shell.task(['node ./scripts/download'], {
	cwd: './node_modules/gtfs'
}));

// install dependencies for api
gulp.task('install_gtfs', shell.task(['npm install'], {
	 cwd: './node_modules/gtfs/examples/express/', 
}));

// Start the gtfs api server on port 3000
gulp.task('start_gtfs', shell.task('node www', {
	cwd: './node_modules/gtfs/examples/express/bin/'
}));

// Start SailsJS app