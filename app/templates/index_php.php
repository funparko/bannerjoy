<?php

$banners = array();
if ($handle = opendir('.')) {
	while (false !== ($entry = readdir($handle))) {
	    if ($entry !== "." && $entry !== ".." && strpos($entry, '.') !== 0 && $entry !== basename(__FILE__)) {
	    	$path = $entry . '/' . 'manifest.json';

	    	if (file_exists($path)) {
	    		$banners[$entry] = json_decode(file_get_contents($path));
	    	} else {
	    		$banners[$entry] = null;	
	    	}
	        
	    }
	}
	ksort($banners);
	closedir($handle);
}
?>
<!DOCTYPE html>
<html>
	<head>
    	<meta charset="utf-8"/>
		<title>Banners</title>
		<!-- Latest compiled and minified CSS -->
		<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css" integrity="sha512-dTfge/zgoMYpP7QbHy4gWMEGsbsdZeCXz7irItjcC3sPUFtf0kuFbDz/ixG7ArTxmDjLXDmezHubeNikyKGVyQ==" crossorigin="anonymous">

		<!-- Optional theme -->
		<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap-theme.min.css" integrity="sha384-aUGj/X2zp5rLCbBxumKTCw2Z50WgIr1vs/PFN4praOTvYXWlVyh2UtNUU0KAUhAX" crossorigin="anonymous">		<style>
		h4 {
			margin:0;
		}
		iframe {
			display: block;
			margin:0 auto;
		}

		</style>
    </head>
  	<body>	

  		<div class="container-fluid">
  			<h1>Banners</h1>
  			
  				<?php foreach ($banners as $folder => $banner): ?>
			  	<div class="panel panel-default">
					<div class="panel-heading"><h4><?php echo $banner->title ?> <small><?php echo $banner->version ?></small></h4></div>
  					<div class="panel-body">
				    	
				    	<iframe scrolling="no" width="<?php echo $banner->width ?>" height="<?php echo $banner->height ?>" frameborder="0" src="<?php echo $folder . '/' . $banner->source ?>"></iframe>
				  	 </div>
				  <div class="panel-footer"><a href="<?php echo $folder . '/' . $banner->source ?>" class="pull-right">View banner</a><?php echo $banner->width ?>x<?php echo $banner->height ?></div>
				</div>
  				<?php endforeach ?>
			</div>
  		</div>
	</body>
</html>
