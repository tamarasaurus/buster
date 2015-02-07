var pages = ['map', 'list', 'form', 'search'];
var root = 'http://localhost:3000';
var icon_url = 'http://www.google.com/mapmaker/mapfiles/marker-k.png';
var selected_url = 'http://www.google.com/intl/en_us/mapfiles/ms/icons/blue-dot.png';

var initMap = function(lat, lng) {
  window.map = new google.maps.Map($('.map').get(0), {
		zoom: 18,
		center: new google.maps.LatLng(lat, lng)
	  });
  
  google.maps.event.addListenerOnce(map, 'idle', function(){
      getNearbyStops(lat, lng, map);
  });
}

var getLocation = function() {
	navigator.geolocation.getCurrentPosition(function(pos) {
		console.log(pos);
		var lat = pos.coords.latitude;
		var lng = pos.coords.longitude;
		initMap(lat, lng);
	}, function(err) {
		console.log(err);
	});
}

var getClosestStop = function() {
	// match to the closest stop?
}

var getNearbyStops = function(lat, lng, map) {
	$.ajax({
		url: root + '/api/stopsNearby/'+lat+'/'+lng+'/0.1',
		type: 'GET',
		dataType: 'json',
		success: function(data) {
			addStopMarkers(data, map);
			addUserMarker(lat, lng, map);
			// Autoselect the closest one
		},
		error: function(err) {
			console.log(err);
		}
	});
}

var addStopMarkers = function(stops, map) {
	var markers = [];
	var infowindows = [];
	
	for(var i = 0; i < stops.length; i++ ) {
		var stop = stops[i];

		var infowindow = new google.maps.InfoWindow({
		     content: '<strong><p>'+stop.stop_name+'</p></strong><br/><button data-id="'+stop.stop_id+'">Select</button>'
		 });

		var marker = new google.maps.Marker({
		  position: new google.maps.LatLng(stop.stop_lat, stop.stop_lon),
		  map: map,
		  infowindow: infowindow
		});

		if(i === 0) {
			marker.setIcon(selected_url);	
		}else {
			marker.setIcon(icon_url);
		}
		
		
		google.maps.event.addListener(marker, 'click', function() {
		    if(window.infowindow) {
		    	window.infowindow.close();
		    }

		    this.infowindow.open(map, this);
		    window.infowindow = this.infowindow;
		});

		if(i === 0) {
			window.closestStop = {data: stop, marker: marker };
		}
		
		markers.push(marker);

	}

	setMarkers(markers, map);
	getNearbyRoutes(window.closestStop)
}

var setMarkers = function(markers, map) {
	for(var i = 0; i < markers.length; i++ ) {
		markers[i].setMap(map)
	}
}

var removeAllMarkers = function() {
	setMarkers(null);
}

var addUserMarker = function(lat, lng, map) {
	var marker = new google.maps.Marker({
	  position: new google.maps.LatLng(lat, lng),
	  map: map,
	  title: 'You'
	});
	marker.setIcon('https://www.google.com/support/enterprise/static/geo/cdate/art/dots/blue_dot.png')
	marker.setMap(map);
}


var getNearbyRoutes = function(stop) {
	console.log('getNearbyRoutes',  stop);
	$.ajax({
		url: root + '/api/routesNearby/'+stop.data.stop_lat+'/'+stop.data.stop_lon+'/0',
		type: 'GET',
		dataType: 'json',
		success: function(data) {
			listRoutes(data);
		},
		error: function(err) {
			console.log(err);
		}
	});
}

var listRoutes = function(routes) {
	$('.list ul').empty();
	for(var i = 0; i < routes.length; i++) {
		var route = routes[i];
		console.log(route)
		$('.list ul').append('<li><strong>'+route.route_short_name+'</strong><p>'+route.route_long_name+'</p></li>')
	}
}

var changePage = function() {

}

var clearPage = function() {

}

var changeHeader = function() {

}


$(document).ready(function(){
	getLocation();

});