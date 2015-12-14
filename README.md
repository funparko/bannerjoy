# BannerJoy

## Installation

Start by installing [Node.js](https://nodejs.org/) if you don't already have that.

##### NPM

Install the generator and it's dependencies.

```
npm install -g yo gulp generator-bannerjoy
```


## Usage

##### Start project

To begin a new banner project create a new folder, run the following command and answer the questions.

```
yo bannerjoy
```

##### Create new banner size

To add a new size to the project run this:

```
yo bannerjoy:size
```

Answer the question about width, height and network. A new folder with will be created in `src`.

##### Distribute

Create minified versions of the banners and zip-files for delivery. 

```
gulp
```

Zip-files for each size with HTML, CSS and JS minified will be created in `delivery`-folder and minified version of the banners will be created in `dist`. All .DS_Store-files will be excluded from the zip-files.

```
gulp watch
```

Experimental gulp watch for Sass.

## Folder structure

* `src` - The sourcecode for the banners is placed here. There is one directory for each banner-size.
* `dist` - Minified versions of the banners after running `gulp` are found here.
* `delivery` - After the `gulp` command has run this folder contains the minified banners zipped. One zip-file per size. 
* `resources` - Folder for placing for example mutual styles and scripts used by multiple banners. The PHP-viewer file is also stored here.