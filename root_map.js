$( function(){
	var rendererOptions = {
	  draggable: false
	};

	var directionsDisplay = new google.maps.DirectionsRenderer( rendererOptions );;
	var directionsService = new google.maps.DirectionsService();
	var map;
	var markers = [];

	var Tokyo = new google.maps.LatLng( 35.41032, 139.44982 );

	var wells;

	google.maps.event.addDomListener( window, 'load', initialize );

	$( "#place_form" ).submit(function(){
		movePos( $( "#place_text" ).val() );
    return false;
	})

	function initialize() {

	  var mapOptions = {
	    zoom: 3,
	    center: Tokyo
	  };
	  map = new google.maps.Map( document.getElementById('map-canvas'), mapOptions );
	  var fluster = new Fluster2( map );

		$.getJSON(
		  'data/well-uniq.geojson',
		  function(data) {
		    for( var i in data.features ){
		    	var marker = new google.maps.Marker({
		    		position: new google.maps.LatLng(
		    				data.features[ i*30 ].properties.lat,
		    				data.features[ i*30 ].properties.lng
		    			),
		    		title: "井戸"
		    	});
		    	fluster.addMarker( marker );
		    	markers.push( marker );
		    	if( i > 1000 ) break;
		    };
		  }
		);

		$.getJSON(
		  'data/drink-water_uniq.geojson',
		  function(data) {
		    for( var i in data.features ){
		    	var marker = new google.maps.Marker({
		    		position: new google.maps.LatLng(
		    				data.features[ i*30 ].properties.lat,
		    				data.features[ i*30 ].properties.lng
		    			),
		    		title: "蛇口"
		    	});
		    	fluster.addMarker( marker );
		    	markers.push( marker );
		    	if( i > 2000 ) break;
		    };
		  }
		);

		$.getJSON(
		  'data/dam_japan.geojson',
		  function(data) {
		    for( var i in data.features ){
		    	var marker = new google.maps.Marker({
		    		position: new google.maps.LatLng(
		    				data.features[ i*30 ].properties.lat,
		    				data.features[ i*30 ].properties.lng
		    			),
		    		title: "ダム"
		    	});
		    	fluster.addMarker( marker );
		    	markers.push( marker );
		    	if( i > 100 ) break;
		    };
		  }
		);
		fluster.initialize();

		google.maps.event.addListener( map, 'idle', function(){
			fluster.showClustersInBounds();
		});
	}
	function movePos( add ){
		console.log(add);
		var geocoder = new google.maps.Geocoder();
		geocoder.geocode({
    	address: add
	  }, function(results, status) {
	  	console.log(results);
	    if (status == google.maps.GeocoderStatus.OK) {
	      var bounds = new google.maps.LatLngBounds();

	      for (var i in results) {
	        if (results[i].geometry) {

	          var latlng = results[i].geometry.location;

	          bounds.extend(latlng);
      			map.fitBounds(bounds);
      			map.setZoom(10);
	        }
	        break;
	      }
	    }
    });
	}
} );
