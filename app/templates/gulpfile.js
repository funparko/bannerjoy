var del  	= require('del');
var es 		= require('event-stream');

var gulp 	= require('gulp');
var gulpLoadPlugins = require('gulp-load-plugins');
var fs 		= require('fs');

var sys 	= require('sys')
var exec 	= require('child_process').exec;
var $ 		= gulpLoadPlugins();

var deliveryDir = 'delivery';
var distDir = 'dist';
var tmpDir = '.tmp';
var sizes = [];

function puts(error, stdout, stderr) { 
	// console.error(error) 
	// console.log('---') 
	// console.log(stdout) 
}

function onError(error, stdout, stderr) { 
	console.error(error) 
	// console.log('---') 
	console.log(stdout) 
}


gulp.task('clean', del.bind(null, [tmpDir, distDir, deliveryDir]));


gulp.task('default', ['clean'], function() {
  	// place code for your default task here
  	var regexp = /^[0-9]+x[0-9]+$/;
	

	var distPath = './' + distDir;
	fs.stat(distPath, function(err, stats) {
		if(err == null) {
	        // console.log(distDir + ' exists');
	    } else if(err.code == 'ENOENT') {
	        fs.mkdir('./' + distDir);
	    } else {
	        console.log('Some other error: ', err.code);
	    }
	});
	
	var deliveryPath = './' + deliveryDir;
	fs.stat(deliveryPath, function(err, stats) {
		if(err == null) {
	        // console.log(distDir + ' exists');
	    } else if(err.code == 'ENOENT') {
	        fs.mkdir('./' + deliveryDir);
	    } else {
	        console.log('Some other error: ', err.code);
	    }
	});

	

	fs.readdir('.', function(err, items) {
	    for (var i=0; i<items.length; i++) {
	        if (items[i].match(regexp)) {
	        	sizes.push(items[i]);
	        }
	        if (i === items.length - 1) {
			  	gulp.start('dist');
			}
	    }
	});

});
  
gulp.task('images', function() {
	var streams = [];

	for (var i = 0; i < sizes.length; i++) {
		var stream = gulp.src(sizes[i] + '/images/*')
			.pipe($.if($.if.isFile, $.cache($.imagemin({
				progressive: true,
				interlaced: true,
				// don't remove IDs from SVGs, they are often used
				// as hooks for embedding and styling
				svgoPlugins: [{cleanupIDs: false}]
			}))
			.on('error', function (err) {
				console.log(err);
				this.end();
			})))
			.pipe(gulp.dest(distDir + '/' + sizes[i] + '/images'));

		streams.push(stream);
	}
	
	return es.concat(streams);
});
  
gulp.task('styles', function() {
	var streams = [];

	for (var i = 0; i < sizes.length; i++) {
		var stream = gulp.src(sizes[i] + '/styles/*.css')
			.pipe($.plumber({
	            errorHandler: onError
	        }))
		    // .pipe($.sourcemaps.init())
		    .pipe($.autoprefixer({browsers: ['> 1%', 'last 2 versions', 'Firefox ESR']}))
		    // .pipe($.sourcemaps.write())
		    .pipe(gulp.dest(tmpDir + '/' + sizes[i] + '/styles'))
		    // .pipe($.reload({stream: true}));

		streams.push(stream);
	}
	return es.concat(streams);
});

gulp.task('html', ['styles'], function() {
	var streams = [];

	for (var i = 0; i < sizes.length; i++) {
		var assets = $.useref.assets({searchPath: [tmpDir + '/' + sizes[i], sizes[i], '.']});
		stream = gulp.src(sizes[i] + '/*.html')
			.pipe(assets)
			.pipe($.if('*.js', $.uglify()))
			.pipe($.if('*.js', $.stripDebug()))
			.pipe($.if('*.css', $.minifyCss({compatibility: '*'})))
			.pipe(assets.restore())
			.pipe($.useref())
			.pipe($.if('*.html', $.minifyHtml({conditionals: true, loose: true})))
			.pipe(gulp.dest(distDir + '/' + sizes[i]));
		
		streams.push(stream);
	}
	return es.concat(streams);

});


gulp.task('extras', function() {
	var streams = [];

	for (var i = 0; i < sizes.length; i++) {
		stream = gulp.src([
			sizes[i] + '/*.*',
			'!' + sizes[i] + '/*.html'
		], {
			dot: true
		}).pipe(gulp.dest(distDir + '/' + sizes[i]));

		streams.push(stream);
	}
	return es.concat(streams);	
});


gulp.task('dist', ['images', 'html', 'extras'], function() {
    for (var i = 0; i < sizes.length; i++) {
    	var src = sizes[i];
    	var dest = deliveryDir + '/' + sizes[i] + '.zip';
        var cmd = [
        	'cd',
        	distDir,
        	'&&',
        	'zip', 
        	'-r', __dirname + '/' + dest, 
        	src, 
        	'-x', '"*.DS_Store"'
        ];
    	// console.log(cmd.join(' '))
    	// console.log($.size({title: 'build', gzip: true}))
    	// console.log('Zip ' + sizes[i] + ' => ' + sizes[i] + '.zip');
		exec(cmd.join(' '), puts);

    	
    };
  	
});
 