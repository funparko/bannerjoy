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
				}]
			}, 
			{
				type    : 'confirm',
				name    : 'ftpUpload',
				message : 'FTP upload?',
				default : false 
			},
			{
				type    : 'input',
				name    : 'ftpServer',
				message : 'FTP-server',
				default : 'ftp.server.com', // Default to current folder name
				store   : true,
				when    : function ( answers ) {
		      return answers.ftpUpload;
		    }
			}, 
			{
				type    : 'input',
				name    : 'ftpUser',
				message : 'FTP-user',
				default : 'username', // Default to current folder name
				store   : true,
				when    : function ( answers ) {
		      return answers.ftpUpload;
		    }
			}, 
			{
				type    : 'input',
				name    : 'ftpPath',
				message : 'FTP-path',
				default : '/public_html', // Default to current folder name
				store   : true,
				when    : function ( answers ) {
		      return answers.ftpUpload;
		    }
			}, 
			{
				type    : 'password',
				name    : 'ftpPassword',
				message : 'FTP-password',
				when    : function ( answers ) {
		      return answers.ftpUpload;
		    }
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

			var config = {};
			if (answers.ftpUpload) {
				config.ftp = {
					host			: answers.ftpServer,
					password 	: answers.ftpPassword,
					user 			: answers.ftpUser,
					path 			: answers.ftpPath
				};
			}
		
			fs.writeFile('./config.json', JSON.stringify(config), function(err) {
				if(err) {
				    return console.log(err);
				}
			}); 
			// this.config.set('includeModernizr', this.includeModernizr)

			this.config.save();


			var data = {
				date: (new Date).toISOString().split('T')[0],
          		pkg: this.pkg.name,
          		version: this.pkg.version,
				name : answers.name,
				clickTag : answers.clickTag,
				phpViewerFile : answers.phpViewerFile,
				ftpUpload : answers.ftpUpload,
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