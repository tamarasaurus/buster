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
		window.userpos = pos;
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
			listRoutes(data, stop.data.stop_id);
		},
		error: function(err) {
			console.log(err);
		}
	});
}

var getStopTimes = function(route_id, stop_id, cb) {
	var url = root + '/api/times/sydneybuses/'+route_id+'/'+stop_id;
	console.log(url);
	$.ajax({
		url: url,
		// url: root + '/api/routesNearby/'+stop.data.stop_lat+'/'+stop.data.stop_lon+'/0',
		type: 'GET',
		dataType: 'json',
		success: cb,
		error: function(err) {
			console.log(err);
		}
	});
	// 
}

var makeRouteItem = function(route, times) {
	var closeTimes = getCloseTimes(times);
	var listitem = '<li data-id="'+route.route_id+'"><strong>'+route.route_short_name+'</strong><p>'+route.route_long_name+'</p><br>'+closeTimes+'</li>';
	return listitem
}

var getCloseTimes = function(times) {
	var currentTime = moment();
	var closeTimes = [];

	for(var i = 0; i < times.length; i++) {
		var date = moment().format('YYYY-MM-DD');
		var time = times[i];
		var time_moment = moment(date + ' ' + time);
		var time_diff = time_moment.diff(currentTime, 'minutes')
		var time_diff_norm = Math.abs(time_diff);
		if( time_diff_norm < 60) {
			var style = (time_diff < 0 ? 'fade' : '');
			if(time_diff_norm < 10) {
				style = 'now'
			}
			closeTimes.push('<span class='+style+'>' + time + '</span>')
		}
	}
	return closeTimes.join('');
}

var listRoutes = function(routes, stop) {
	window.routes = routes;
	$('.list ul li').off();
	$('.list ul').empty();

	for(var i = 0; i < routes.length; i++) {
		var route = routes[i];
		getStopTimes(route.route_id, stop, function(times) {
			var listitem = makeRouteItem(this.route, times);
			$('.list ul').append(listitem);
		}.bind({route: routes[i]}));
	}

	setListClicks();
}


var setListClicks = function() {
	$(document).on('click', '.list ul li', function(){
		console.log($(this));
		var id = $(this).data('id');
		changePage('.form');
		populateRoutePage(id)
	});	
}


var changePage = function(set) {
	$('.page').addClass('hidden');
	$(set).removeClass('hidden');
}

var getRoute = function(id) {
	if(!window.routes) {
		return;
	}

	var match = {};

	for(var i = 0; i < window.routes.length; i++) {
		if(window.routes[i].route_id === id) {
			match = window.routes[i];
		}
	}
	return match;
}

var populateRoutePage = function(id) {
	var route = getRoute(id);
	console.log(route);
	changeHeader('< '+route.route_short_name + ' bus report');
	$('.page.form p').html('The <div data-route="'+route.route_short_name + '">'+route.route_short_name+'</div> is');
	$('.page form').attr('data-id', id);
}


var changeHeader = function(text) {
	var header = text || 'Buster';
	$('header').text(header);
}


var showReport = function(res) {
	changePage('.report');
	changeHeader('< '+res.route_short_name + ' bus report');
}

var getReport = function(res) {
	showReport(res);
	console.log(res);
}

var sendReport = function() {
	var report = {
		stop_id: window.closestStop.data.stop_id,
		route_id: $('.page form').data('id'),
		route_short_name:  $('.page form [data-route]').data('route'),
		latitude: window.userpos.coords.latitude,
		longitude: window.userpos.coords.longitude,
		user_accuracy: window.userpos.coords.accuracy,
		late: $('#late').is(':checked'),
		capacity: 2.5,
		user_fingerprint: new Fingerprint({canvas: true}).get()
	}	

	$.ajax({
		url: 'http://localhost:1337/submission/create',
		type: 'POST',
		data: report,
		dataType: 'json',
		success: function(res) {
			// console.log('success', res);
			getReport(res);
		},
		error: function(err) {
			console.log('err', jQuery.parseJSON(err.responseText));
		}
	});

	// Send the report
	console.log(report);
}

$(document).ready(function(){
	getLocation();

	$('.page button').on('click', function(e){
		sendReport();

		e.preventDefault();
		return false;
	});

	$('header').on('click', function(){
		changeHeader();
		$('.page').addClass('hidden');
		$('.map').removeClass('hidden');
		$('.list').removeClass('hidden');
	});

});