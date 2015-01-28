Andrew Magnus
amm215
11140881

-This Assignment runs best in Mozilla Firefox
-There will be TWO popups asking to use your location (every call to geolocation asks for your location,
 you simply can't do two calls together for different things) so make sure to wait for both to appear to have the 
 page work appropiatly
-The webpage is responsive, if the screen size shrinks, the sidebar will go below the map
-The following Files are created for the assignment by me
	- assn1.html
	- googleMaps.js
	- assn1.appcache
	The rest of the files are part of the bootstrap distribution and have only been used, not altered by myself

Things to be aware of:
Task B:
	- The "You started from here!" marker IS created, but it gets covered by the current
	  location marker (Task E) after you accept the second popup for your location.
Task D:
	- The distance between the two points is the "route Distance" on the sidebar. this also shows when the "show the way"
	  button is pressed
Task E:
	- There is a section of code that can be uncommented to test the code to see the moving current waypoint in action! It is near the bottom of the googleMaps.js file

Bonus: Attempted to use the Application Cache, everything but the map seems to cache, not sure why this is. It might not be possible to 
	   directly cache a map


