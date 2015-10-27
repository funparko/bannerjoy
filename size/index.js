var generators = require('yeoman-generator');
var mkdirp = require('mkdirp');

module.exports = generators.Base.extend({
	constructor : function () {
		generators.Base.apply(this, arguments);
		this.argument('size', { 
			type: String, 
			optional : true, 
			required : false
		});
		// And you can then access it later on this way; e.g. CamelCased
		// this.log(this.size);
  	},
  	prompting : function () {
		var done = this.async();
			this.prompt([
			{
				type    : 'input',
				name    : 'width',
				message : 'Width:'
			},
			{
				type    : 'input',
				name    : 'height',
				message : 'Height:'
			},
			{
				type    : 'input',
				name    : 'media',
				message : 'Media (optional):'
			},
			{
				type    : 'input',
				name    : 'placement',
				message : 'Placement (optional):'
			}
		], function (answers) {
			this.width = parseInt(answers.width);
			this.height = parseInt(answers.height);
			this.size = answers.width + 'x' + answers.height;
			this.placement = answers.placement;
			this.media = answers.media;

			var sizes = this.config.get('sizes');
			if (!sizes) {
				sizes = [];
			}
			sizes.push({
				width : this.width,
				height : this.height,
				placement : this.placement,
				media : this.media,
				size : this.size
			});

			this.config.set('sizes', sizes);

			done();
		}.bind(this));
	},
  	templates : function () {
  		var data = {
			name: this.config.get('name'),
			includeAdForm: this.config.get('includeAdForm'),
			clickTag: this.config.get('clickTag'),
			size: this.size,
			width: this.width,
			height: this.height
		};
		this.fs.copyTpl(
			this.templatePath('index.html'),
			this.destinationPath(this.size + '/index.html'),
			data
		);
		this.fs.copyTpl(
			this.templatePath('manifest.json'),
			this.destinationPath(this.size + '/manifest.json'),
			data
		);
		this.fs.copyTpl(
			this.templatePath('main.css'),
			this.destinationPath(this.size + '/styles/main.css'),
			data
		);
		this.fs.copyTpl(
			this.templatePath('main.js'),
			this.destinationPath(this.size + '/scripts/main.js'),
			data
		);
		mkdirp(this.size + '/images');

	}
});