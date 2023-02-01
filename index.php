<!doctype html>
<html lang="en">

    <head>
		<meta name="viewport" content="width=device-width,initial-scale=1">
		<meta name="viewport" content="width=device-width; content='width = 320; initial-scale=1.0; maximum-scale=1.0; user-scalable=yes; target-densitydpi=160dpi">
        <meta charset="UTF-8">    
        <title>Google maps</title>
		<link href="rts/bootstrap.min.css" rel="stylesheet" />
      </head>  
<body>
        <div id="map_canvas" style="height:600px;"></div>
        <div id="distance"></div>
		<select id="ways" class="form-select" aria-label="Default select example">
		      <option value="0">Select Destination</option>  
		      <option value="40.71549144576898||-73.9979047152832">Canal Street, NY 10013, USA</option>  
			  <option value="40.72947702863487||-74.00511449311523">New York, NY 10014, USA</option>      	
		</select>
        <div id="directionsPanel"></div>
        <script src="js/jquery.min.js"></script>
        <script src="https://maps.googleapis.com/maps/api/js?key={api_key}&sensor=false&language=fa&amp;libraries=places&callback=initAutocomplete"></script>
		<script src="js/jquery.min.js"></script>
		<script src="js/location.js"></script>
</body>
