var generators = require('yeoman-generator');

module.exports = generators.Base.extend({
	constructor: function () {
		generators.Base.apply(this, arguments);

		this.argument('name', { 
			type: String, 
			optional : true, 
			required : false,
			defaults : this.name
		});
		// And you can then access it later on this way; e.g. CamelCased
		this.log(this.name);
  	},
  	prompting: function () {
		var done = this.async();
			this.prompt([
			{
				type    : 'input',
				name    : 'name',
				message : 'Project name',
				default : this.name // Default to current folder name
			}, 
			{
				type    : 'input',
				name    : 'clickTag',
				message : 'ClickTag',
				default : 'http://example.com' 
			}, 
			{
		      type: 'confirm',
		      name: 'includeAdForm',
		      message: 'Include AdForm?',
		      default: true,
      		}
		], function (answers) {
			// this.log(answers);
			this.config.set('name', answers.name)
			this.config.set('includeAdForm', answers.includeAdForm)
			this.config.set('clickTag', answers.clickTag)

			this.config.save()

			this.fs.copyTpl(
				this.templatePath('gulpfile.js'),
				this.destinationPath('gulpfile.js'),
				answers
			);
			this.fs.copyTpl(
				this.templatePath('gitignore'),
				this.destinationPath('.gitignore'),
				answers
			);
			this.fs.copyTpl(
				this.templatePath('_package.json'),
				this.destinationPath('package.json'),
				answers
			);

			 this.npmInstall();

			done();
		}.bind(this));
	}
});