'use strict';
var path = require('path');
var assert = require('yeoman-assert');
var helpers = require('yeoman-generator').test;

describe('gulp tasks', function () {
  before(function (done) {
    helpers.run(path.join(__dirname, '../app'))
      .inTmpDir()
      .withOptions({'skip-install': true})
      .withPrompts({features: []})
      .on('end', done);
  });

  it('should contain necessary tasks', function () {
    [
      'clean',
      'default',
      'dist',
      'extras',
      'html',
      'images',
      'sizes',
      'styles',
      'serve'
    ].forEach(function (task) {
      assert.fileContent('gulpfile.js', 'gulp.task(\'' + task);
    });
  });
});