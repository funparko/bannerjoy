// generated on <%= date %> using <%= pkg %> <%= version %>

// {date} {size}
var zipNamepattern = '{size}';


var del = require('del'),
  es = require('event-stream'),
  gulp = require('gulp'),
  gulpLoadPlugins = require('gulp-load-plugins'),
  fs = require('fs');
  exec = require('child_process').exec
  $ = gulpLoadPlugins(),
  browserSync = require('browser-sync')<% if (ftpUpload) { %>,
  ftp = require( 'vinyl-ftp' )<% } %>;


var reload = browserSync.reload;
var sizes = [];
var regexp = /^[0-9]+x[0-9]+(_.*)?$/;

// Directories
var deliveryDir = 'delivery',
  tmpDir = '.tmp',
  distDir = 'dist',
  resourcesDir = 'resources',
  srcDir = 'src';

var configFile = './config.json';

var onError = function(error, stdout, stderr) { 
  console.error(error) 
  console.log(stdout) 
}


gulp.task('clean', del.bind(null, [tmpDir, distDir, deliveryDir]));


gulp.task('sizes', function(callback) {
  fs.readdir(srcDir, function(err, items) {
    if (items.length === 0) {
      callback();
    }

    for (var i=0; i<items.length; i++) {
        if (items[i].match(regexp) && sizes.indexOf(items[i]) === -1) {
          sizes.push(items[i]);
        }
        if (i === items.length - 1 && callback) {
        callback();
      }
    }
  });
});

<% if (ftpUpload) { %>

gulp.task('deploy',  function() {
  var config = JSON.parse(fs.readFileSync(configFile));
  
  var conn = ftp.create( {
    host:     config.ftp.host,
    user:     config.ftp.user,
    password: config.ftp.password,
    parallel: 10,
    log:      $.util.log
  } );

  var globs = [
    distDir + '/**'
  ];

  return gulp.src( globs, { base: distDir, buffer: false } )
      .pipe( conn.newer( config.ftp.path ) ) // only upload newer files
      .pipe( conn.dest( config.ftp.path ) );

});
<% } %>


gulp.task('default', ['clean', 'sizes'], function() {
  gulp.start('dist');
});
  
gulp.task('images', function() {
  var streams = [];

  for (var i = 0; i < sizes.length; i++) {
    streams.push(gulp.src(srcDir + '/' + sizes[i] + '/images/*')
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
      .pipe(gulp.dest(distDir + '/' + sizes[i] + '/images')));

  }
  
  return es.concat(streams);
});

<% if (includeSass) { %>

var compileSass = function(path) {
  return gulp.src(path)
    .pipe($.plumber({errorHandler: $.notify.onError("SASS error: <" + "%= error.message %" + ">")}))
    .pipe($.sourcemaps.init())
    .pipe($.sass.sync({
      outputStyle: 'expanded',
      precision: 10,
      includePaths: ['.']
    }).on('error', $.sass.logError))
      .pipe($.autoprefixer({browsers: ['> 1%', 'last 3 versions', 'Firefox ESR']}))
      .pipe($.sourcemaps.write())
      .pipe(gulp.dest(function(file) {
      return file.base;
    }))
    .pipe($.notify({
      title: 'Compiled SASS',
      message: path
    }));
      // .pipe(reload({stream: true}));
}

<% } %>
  
gulp.task('styles', ['sizes'], function(callback) {

  if (sizes.length === 0) {
    callback();
  }

  var streams = [];
  for (var i = 0; i < sizes.length; i++) {
    <% if (includeSass) { %>
    streams.push(compileSass(srcDir + '/' + sizes[i] + '/styles/*.scss'));
    <% } else { %>
    streams.push(gulp.src(srcDir + '/' + sizes[i] + '/styles/*.css')
        // .pipe($.sourcemaps.init())
        .pipe($.autoprefixer({browsers: ['> 1%', 'last 2 versions', 'Firefox ESR']}))
        // .pipe($.sourcemaps.write())
        .pipe(gulp.dest(tmpDir + '/' + sizes[i] + '/styles')));
        // .pipe($.reload({stream: true}));
    <% } %>

  }
  return es.concat(streams)

});

gulp.task('html', ['styles'], function() {
  var streams = [];

  for (var i = 0; i < sizes.length; i++) {
    var assets = $.useref.assets({searchPath: [tmpDir + '/' + sizes[i], srcDir + '/' + sizes[i], '.']});
    streams.push(gulp.src(srcDir + '/' + sizes[i] + '/*.html')
      .pipe(assets)
      .pipe($.if('*.js', $.uglify()))
      .pipe($.if('*.js', $.stripDebug()))
      .pipe($.if('*.css', $.cssnano()))
      .pipe($.if('*.css', $.autoprefixer({browsers: ['> 1%', 'last 3 versions', 'Firefox ESR']})))
      .pipe(assets.restore())
      .pipe($.useref())
      .pipe($.if('*.html', $.htmlmin({conditionals: true, loose: true})))
      .pipe(gulp.dest(distDir + '/' + sizes[i])));
    
  }
  return es.concat(streams);

});


gulp.task('extras', function() {
  var streams = [];

  for (var i = 0; i < sizes.length; i++) {
    streams.push(gulp.src([
      srcDir + '/' + sizes[i] + '/*.*',
      '!' + srcDir + '/' + sizes[i] + '/*.html'
    ], {
      dot: true
    }).pipe(gulp.dest(distDir + '/' + sizes[i])));
  }
  return es.concat(streams);  
});


gulp.task('watch', ['sizes'], function() {
  gulp.watch(srcDir + '/**/styles/*.scss').on('change', function(event) {
    compileSass(event.path);
  }); 
  gulp.watch(resourcesDir + '/**/styles/*.scss').on('change', function() {
    for (var i = 0; i < sizes.length; i++) {
      compileSass(srcDir + '/' + sizes[i] + '/styles/*.scss');
    }
  });
});


gulp.task('dist', ['images', 'html', 'extras'], function() {
  
  <% if (phpViewerFile) { %>
  gulp.src(resourcesDir + '/' + 'index_php')
    .pipe($.rename({
      basename: "index",
      extname: ".php"
    }))
    .pipe(gulp.dest(distDir));
  <% } %>
  
  $.util.log($.util.colors.yellow('------------- Size of Zip-files -------------'));
  var longestString = 0;
  for (var i = 0; i < sizes.length; i++) {
    if (sizes[i].length > longestString) {
      longestString = sizes[i].length;
    }
  }
  
  var streams = [];
  for (var i = 0; i < sizes.length; i++) {
    var pad = new Array(longestString - sizes[i].length + 1).join(' ');
    var date = new Date().toISOString().slice(0, 10);

    var zipFile = zipNamepattern.replace('{size}', sizes[i]).replace('{date}', date) + '.zip';
    streams.push(gulp.src(distDir + '/' + sizes[i] + '/**/*')
      .pipe($.zip(zipFile))
      .pipe($.size({title : '💩  ' +  zipFile + pad}))
      .pipe(gulp.dest(deliveryDir)));

  }
  
  var pipe = es.concat(streams);
  pipe.on('end', function () {
    $.util.log($.util.colors.yellow('--------------------------------------------')); 
  });
  return pipe;

});
 
