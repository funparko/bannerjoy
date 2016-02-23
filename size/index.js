var generators = require('yeoman-generator');
var mkdirp = require('mkdirp');
var scrDir = 'src';
var adNetworks = [
	{value : 'adform', name : 'Adform'},
	{value : 'doubleclick', name : 'DoubleClick'},
	{value : 'none', name : 'None'}
];


module.exports = generators.Base.extend({
	constructor : function () {
		generators.Base.apply(this, arguments);
		// this.argument('size', { 
		// 	type: String, 
		// 	optional : true, 
		// 	required : false
		// });
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
				name    : 'name',
				message : 'Name (optional):'
			},
			{
				type: 'list',
				name: 'network',
				choices: adNetworks,
				message: 'Use an Ad-network?',
				default: 'none',
				store: true,
      		}
		], function (answers) {
			this.width = parseInt(answers.width);
			this.height = parseInt(answers.height);
			this.size = answers.width + 'x' + answers.height;
			this.name = answers.name;
			this.network = answers.network;



			// var sizes = this.config.get('sizes');
			
			// if (!sizes) {
			// 	sizes = [];
			// }
			// sizes.push({
			// 	width : this.width,
			// 	height : this.height,
			// 	name : this.name,
			// 	network : this.network,
			// 	size : this.size
			// });

			// this.config.set('sizes', sizes);

			done();
		}.bind(this));
	},
  	templates : function () {

  		var data = {
			name: this.name,
			appName: this.config.get('name'),
			includeSass: this.config.get('includeSass'),
			network: this.network,
			clickTag: this.config.get('clickTag'),
			size: this.size,
			width: this.width,
			height: this.height
		};

		var name = this.name ? this.name.replace(/\s/, '_').toLowerCase() : '';
		var folderName = scrDir + '/' + this.size + (name.length > 0 ? '_' + name : ''); 

		this.fs.copyTpl(
			this.templatePath('index.html'),
			this.destinationPath(folderName + '/index.html'),
			data
		);
		this.fs.copyTpl(
			this.templatePath('manifest.json'),
			this.destinationPath(folderName + '/manifest.json'),
			data
		);
		this.fs.copyTpl(
			this.templatePath('main.css'),
			this.destinationPath(folderName+ '/styles/main.' + (data.includeSass ? 'scss' : 'css')),
			data
		);
		this.fs.copyTpl(
			this.templatePath('main.js'),
			this.destinationPath(folderName + '/scripts/main.js'),
			data
		);
		
		mkdirp(folderName + '/images');

	}
});