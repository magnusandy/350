/*
Assignment 1
Andrew Magnus
amm215
11140881
*/
		var directionsDisplay;
		var directionsService = new google.maps.DirectionsService();
		var map;
		var pos;
		var travelMode; // this is the default travel mode if the selector has not been used
		var geocoder;

		var startMarker = new google.maps.Marker();
		var endMarker = new google.maps.Marker();

		var startingPos;

		/**
		Initialize the Map and route service as well as draw the starting position
		marker and start the watching of current position
		*/
		function initialize() {
		//Prepare the Direction Service and Map for use
		travelMode = document.getElementById('mode').value;
		var renderOpts = {
			suppressMarkers: true
		}
		directionsDisplay = new google.maps.DirectionsRenderer(renderOpts);
		  var mapOptions = {
			zoom: 8
		  };
		  map = new google.maps.Map(document.getElementById('map'),
			  mapOptions);
		  directionsDisplay.setMap(map);
		  
		  // Try HTML5 geolocation
		  //Checks to see if The browser supports GeoLocations
		  if(!navigator.geolocation)
		  {
			alert("Browser NOT compatable with HTML5 Geolocation API");	
		  }
		  else
		  {
		  //Place a marker for starting position and display latlong
		  //of the start
			navigator.geolocation.getCurrentPosition(
			function(position) {
			   pos = new google.maps.LatLng(position.coords.latitude,
											   position.coords.longitude);

			  var startedHere = new google.maps.Marker({
				map: map,
				position: pos,
				title: 'You Started From Here!'
			  });
			  map.setCenter(pos);
			  var displayCoords = document.getElementById("DisplayLatLong") ;
			  displayCoords.innerHTML = "<strong>Your Starting Position:</strong> <br> Latitude: " + pos.lat().toFixed(14) +
			"<br>Longitude: " + pos.lng().toFixed(14); 
			//create a call to watch position to set up the watching of current position
			navigator.geolocation.watchPosition(showPosition);
			},
			function() {
			  handleNoGeolocation(true);
			});
		  }  
		}

		/**
		deal with the option that geolocation is not available
		*/
		function handleNoGeolocation(errorFlag) {
			alert("Browser NOT compatable with HTML5 Geolocation API");	
		}

		/**
		Calculates and draws a route for the given start and dest text boxes
		on the page.
		*/
		function calcRoute(starting, dest) {
			//the travel mode is changed with the changeTravelMode method and saved in the TravelMode variable
			var selectedMode = travelMode;
			var waypoint = [];
			waypoint.push(
			{
			location:currentMarker.position,
			stopover:true
			}
			);
			  var request = {
				  origin: starting,
				  destination: dest,
				  travelMode: google.maps.TravelMode[selectedMode],
				  waypoints: waypoint
			  };
			  //draws the route on the map
			  directionsService.route(request, function(response, status) {
				if (status == google.maps.DirectionsStatus.OK) {
				  //display distance of route in kilometers
				  var displayDistance = document.getElementById("displaydistance") ;
			  displayDistance.innerHTML = "<strong>Route Distance:</strong> "+ (response.routes[0].legs[0].distance.value+response.routes[0].legs[1].distance.value)/1000 + " km";
			  document.getElementById("betweenCurrStart").innerHTML = "<strong>Distance From Start:</strong>" + 
				(response.routes[0].legs[1].distance.value/1000).toFixed(2) + " km";
			document.getElementById("betweenCurrDest").innerHTML = "<strong>Distance To Destination:</strong>" +
				(response.routes[0].legs[0].distance.value/1000).toFixed(2) + " km";

				  directionsDisplay.setDirections(response);
				  
				}
			  });
			  

		}

		/**
		Changes the global travel mode when the selector changes
		also recalculates any current routes with the new travel mode
		*/
		function changeTravelMode() {
		travelMode = document.getElementById('mode').value;
		calcRoute(startMarker.getPosition(), endMarker.getPosition());
		}

		/**
		Takes two address strings like "Saskatoon Airport, 20543 Airport drive" and converts
		it to a latitude and longitude and creates markers with distinct titles at the end of a route
		*/
		function geocodeEnd(start, end){
			geocoder = new google.maps.Geocoder();
			endMarker.setMap(null);
			startMarker.setMap(null);
			var geocodeOptionsStart = {
				address: start
			}
			//geocode the starting place and create a marker
			geocoder.geocode( geocodeOptionsStart, function(results, status){
				if(status == google.maps.GeocoderStatus.OK)
				{
					startMarker = new google.maps.Marker({
						map: map,
						position: results[0].geometry.location,
						title: "Your Starting Place!"
					});
				}
				else
				{	
					alert("Geogcoder problem")
				}
			});
			
			var geocodeOptionsEnd = {
				address: end
			}
			//geocode the destination and create a marker
			geocoder.geocode( geocodeOptionsEnd, function(results, status){
				if(status == google.maps.GeocoderStatus.OK)
				{
					endMarker.setPosition(results[0].geometry.location);
					endMarker.setMap(map);	
					endMarker.setTitle("Your Destination Place");
				}
				else
				{	
					alert("Geogcoder problem")
				}
			});
		}

		/**
		Draws the route and places custom MARKERS on the ends of the routes at the give addresses for the route
		this function is called when "show the way" is pressed
		*/
		function geocodeAndCalc()
		{
			var startAddress = document.getElementById("starting").value;
			var dest = document.getElementById("dest").value;
			geocodeEnd(startAddress, dest);
			calcRoute(startAddress, dest);
		}

		/**
		checks that both given values are between 53 and 51.5
		*/
		function validateLats(startLat, endLat)
		{
			var startValue = startLat.value;
			var endValue = endLat.value;
			if((startValue >= 51.5 && startValue <= 53.0) && (endValue >= 51.5 && endValue <= 53.0))
			{
				return true;
			}
			else
			{
				return false;
			}
		}

		/**
		checks that both given values are between -107 and -106.5
		*/
		function validateLongs(startLong, endLong)
		{
			var startValue = startLong.value;
			var endValue = endLong.value;
			if((startValue >= -107.0 && startValue <= -106.5) && (endValue >= -107.0 && endValue <= -106.5))
			{
				return true;
			}
			else
			{
				return false;
			}
		}

		/**
		action taken when the Track Path button is pressed, first checks if the lat and long fields are valid
		then proceeds from there or warns the user
		*/
		function trackPath()
		{
			var validLats = validateLats(document.getElementById("startLat"), document.getElementById("endLat"));
			var validLongs = validateLongs(document.getElementById("startLong"), document.getElementById("endLong"));
			if(validLats && validLongs)
			{
			//draws new markers on the map and calcs new routes
			var startingLatLong = new google.maps.LatLng(document.getElementById("startLat").value, document.getElementById("startLong").value);
			var endingLatLong = new google.maps.LatLng(document.getElementById("endLat").value, document.getElementById("endLong").value);
			startMarker.setMap(null);
			startMarker.setPosition(startingLatLong);
			startMarker.setMap(map);
			startMarker.setTitle("Starting Place");
			endMarker.setMap(null);
			endMarker.setPosition(endingLatLong);
			endMarker.setMap(map);
			endMarker.setTitle("Destination Place");
			calcRoute(startingLatLong, endingLatLong);

			}
			else
			{
				alert("Value of Latitudes must be between 53 and 51.5, \nValue of Longitudes must be between -107 and -106.5")
			}
			
		}

		var currentLat;
		var currentLong;
		var currentLat1;
		var currentLong1;
		var currentMarker = new google.maps.Marker();

		/**
		This function is set up to be called preiodicly by the watchposition()
		*/
		function showPosition(position)
		{
		//This first part is if the current position has changed 
		if(currentLat != position.coords.latitude || currentLong != position.coords.longitude)
		{	
			//update the <p> the displays current Long and Lat, as well as draw a new marker
			// and chnge distance from start and end <p>'s
			currentLat = position.coords.latitude;
			currentLong = position.coords.longitude;
			currentLong1 = currentLong;
			currentLat1 = currentLat;
			var currentLoc = document.getElementById("currentLoc");
			currentLoc.innerHTML = "<strong>Your Current Position:</strong><br>Latitude: " + currentLat.toFixed(14) + 
			"<br>Longitude: " + currentLong.toFixed(14);
			//draw marker at current position
			var currentLatLong = new google.maps.LatLng(currentLat, currentLong);
			currentMarker.setMap(null);
			  currentMarker = new google.maps.Marker({
				map: map,
				position: currentLatLong,
				title: 'CURRENT LOCATION!'
			  });
			calcRoute(startMarker.getPosition(), endMarker.getPosition());

			}
		else
		{
		//nothing has changed;
			/** UNCOMMENT THIS CODE TO WATCH THE CURRENT LOCATION MOVE!
			currentLong1 = currentLong1 +0.01;
			currentLat1 = currentLat1+0.01;
			var currentLoc = document.getElementById("currentLoc");
			currentLoc.innerHTML = "Your Current Position:<br>Latitude: " + currentLat1 + 
			"<br>Longitude: " + currentLong1;
			//draw marker at current position
			var currentLatLong = new google.maps.LatLng(currentLat1, currentLong1);
			currentMarker.setMap(null);
			  currentMarker = new google.maps.Marker({
				map: map,
				position: currentLatLong,
				title: 'CURRENT LOCATION!'
			  });
			  calcRoute(startMarker.getPosition(), endMarker.getPosition());
			*/
		}	
		}
		google.maps.event.addDomListener(window, 'load', initialize);