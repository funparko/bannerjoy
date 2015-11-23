var generators = require('yeoman-generator');
var fs = require('fs');
var yosay = require('yosay');

module.exports = generators.Base.extend({
	constructor: function () {
		generators.Base.apply(this, arguments);

		this.argument('name', { 
			type: String, 
			optional : true, 
			required : false,
			defaults : this.appname
		});
		// And you can then access it later on this way; e.g. CamelCased
		// this.log(this.appname);
  	},

	
	initializing: function () {
		this.pkg = require('../package.json');
	},


  	prompting: function () {

  		this.log(yosay('Oh Banner Joy! Please answer a few questions!'));

		var done = this.async();
		this.prompt([
			{
				type    : 'input',
				name    : 'name',
				message : 'Project name',
				default : this.appname // Default to current folder name
			}, 
			{
				type    : 'input',
				name    : 'clickTag',
				message : 'ClickTag',
				store : true,
				default : 'http://example.com' 
			}, 
			{
				type    : 'confirm',
				name    : 'phpViewerFile',
				message : 'Add a php viewerfile in dist?',
				default : false 
			},
			{
				type: 'checkbox',
				name: 'features',
				message: 'What more would you like?',
				choices: [{
					name: 'Sass',
					value: 'includeSass',
					checked: true
				} 
				// ,{
				// 	name: 'Modernizr',
				// 	value: 'includeModernizr',
				// 	checked: true
				// }
				]
			}
		], function (answers) {
			// this.log(answers);

			var features = answers.features;

			function hasFeature(feat) {
				return features && features.indexOf(feat) !== -1;
			};

			this.includeSass = hasFeature('includeSass');
			// this.includeModernizr = hasFeature('includeModernizr');

			this.config.set('name', answers.name)
			this.config.set('clickTag', answers.clickTag)
			this.config.set('phpViewerFile', answers.phpViewerFile)
			this.config.set('includeSass', this.includeSass)
			// this.config.set('includeModernizr', this.includeModernizr)

			this.config.save();
			var data = {
				date: (new Date).toISOString().split('T')[0],
          		pkg: this.pkg.name,
          		version: this.pkg.version,
				name : answers.name,
				clickTag : answers.clickTag,
				phpViewerFile : answers.phpViewerFile,
				includeSass : this.includeSass
			}

			this.fs.copyTpl(
				this.templatePath('gulpfile.js'),
				this.destinationPath('gulpfile.js'),
				data
			);
			this.fs.copyTpl(
				this.templatePath('gitignore'),
				this.destinationPath('.gitignore'),
				data
			);
			this.fs.copyTpl(
				this.templatePath('_package.json'),
				this.destinationPath('package.json'),
				data
			);
			if (answers.phpViewerFile) {
				this.fs.copyTpl(
					this.templatePath('index_php'),
					this.destinationPath('resources/index_php'),
					data
				);
			}

			fs.mkdir('./src');

			this.npmInstall();

			done();
		}.bind(this));
	}
});