'use strict';
var path = require('path');
var helpers = require('yeoman-generator').test;
var assert = require('yeoman-assert');

var bannerWidth = 300;
var bannerHeight = 600;
var bannerName = 'Banner Name';

describe('size without name', function () {
  before(function (done) {
    helpers.run(path.join(__dirname, '../size'))
      // .inDir(path.join(__dirname, 'tmp'))
      .inTmpDir()
      .withOptions({})
      .withPrompts({width: bannerWidth, height: bannerHeight})
      .withGenerators([
        [helpers.createDummyGenerator(), 'mocha:app']
      ])
      .on('end', done);
  });

  it('the generator can be required without throwing', function () {
    // not testing the actual run of generators yet
    require('../size');
  });

  it('creates expected files', function () {
    var dir = 'src/' + bannerWidth + 'x' + bannerHeight;
    assert.file([
      dir + '/images',
      dir + '/scripts/main.js',
      dir + '/styles/main.css',
      dir + '/index.html',
      dir + '/manifest.json'
    ]);
  });
});

describe('size with name', function () {
  before(function (done) {
    helpers.run(path.join(__dirname, '../size'))
      // .inDir(path.join(__dirname, 'tmp'))
      .inTmpDir()
      .withOptions({})
      .withPrompts({width: bannerWidth, height: bannerHeight, name : bannerName})
      .withGenerators([
        [helpers.createDummyGenerator(), 'mocha:app']
      ])
      .on('end', done);
  });

  it('the generator can be required without throwing', function () {
    // not testing the actual run of generators yet
    require('../size');
  });

  it('creates expected files', function () {
    var dir = 'src/' + bannerWidth + 'x' + bannerHeight + '_banner_name';
    assert.file([
      dir + '/images',
      dir + '/scripts/main.js',
      dir + '/styles/main.css',
      dir + '/index.html',
      dir + '/manifest.json'
    ]);
  });
});


bannerWidth = 500;
bannerHeight = 600;

describe('size with sass active', function () {
  before(function (done) {
     helpers.run(path.join(__dirname, '../size'))
      // .inDir(path.join(__dirname, 'tmp'))
      .inTmpDir()
      .withOptions({})
      .withLocalConfig({includeSass:true})
      .withPrompts({width: bannerWidth, height: bannerHeight, name : bannerName})
      .withGenerators([
        [helpers.createDummyGenerator(), 'mocha:app']
      ])
      .on('end', done);
  });

  it('creates expected files', function () {

    var dir = 'src/' + bannerWidth + 'x' + bannerHeight + '_banner_name';
    assert.file([
      dir + '/images',
      dir + '/scripts/main.js',
      dir + '/styles/main.scss',
      dir + '/index.html',
      dir + '/manifest.json'
    ]);
  });
});