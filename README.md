# BannerJoy

## Install

Start by installing [Node.js](https://nodejs.org/) if you don't already have that.

##### Yeoman

```
npm install -g yeoman
```

##### Gulp

```
npm install -g gulp
```

##### BannerJoy

```
npm install -g generator-bannerjoy
```

## Usage

##### Start project

Create a new folder and begin a new bannerproject.

```
yo bannerjoy
```

##### Create new banner size

```
yo bannerjoy:size
```

Answer the question about width and height.

##### Distribute

Create 

```
gulp
```

Zip-files for each size with HTML, CSS and JS minified will be created in the delivery folder and minified version of the banners will be created in dist folder. All .DS_Store-files will be excluded from the zip-files.