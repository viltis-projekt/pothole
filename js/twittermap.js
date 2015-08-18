// namespace
var maptwitter = {};
var map;
var infowindow= new google.maps.InfoWindow();
var markers = [];

// initialize function
maptwitter.init = function()
{
	
	
	
	
	//center lat/lon
	var latlng = new google.maps.LatLng(-7.2853678,112.7429268);
 
	//map configutations
	var myOptions = {
		zoom: 13,
		center: latlng,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};
 
	//create the map
	map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
	
	// event listener on the "go" button
	//$('#search-button').click(function(){
		maptwitter.getTweets();
	//})
}

// run the init function on page load
$( document ).ready(function() {
	maptwitter.init();
});

//get tweets
maptwitter.getTweets = function() 
{
	
	// clear any content from the tweet list
	$('#tweetlist').empty();
	

	// clear map of existing markers
	for (i in markers) { markers[i].setMap(null) };

	
	// get the search keyword
	var search_keyword = $('#search-text').val();
	
	
	// get the center of the map
	var centerLat = map.getCenter().lat();
	var centerLng = map.getCenter().lng();

	// construct the geocode query string
	var geocodequery = centerLat + ',' + centerLng + ',20mi';
	 
	// set the proxyurl
	var proxyurl = 'search.php?q=' + search_keyword + '&geocode=' + geocodequery;
	
	// call the proxy file to get tweets from Twitter
	$.getJSON(proxyurl,function(data){
		$.each(data.statuses, function(i,item){
			$('#tweetlist').append('<div>'+item.text+'</div><hr>');

			// add each tweet to the map
			//if(item.geo)
			if(item.entities.media) //luck iki piye carane ben if e ngefilter 2 dadi if(item.entities.media) karo if(item.geo)
			{
				var tweet = 
				{
					lat: item.geo.coordinates[0],
					lng: item.geo.coordinates[1], 
					name: item.text,
					info: '<b>'+ item.text + '</b><br><br><a href="' + item.entities.media[0].media_url + '", target="_blank"><img src=' + item.entities.media[0].media_url + ' height="100" width="100"></a>',
					icon: item.user.profile_image_url					
				}

				// map it
				maptwitter.createMarker(tweet)
			}
		});		
	})
}

// create marker
maptwitter.createMarker = function(options){
	var markerLatLng = new google.maps.LatLng(options.lat,options.lng);
	var marker = new google.maps.Marker({
		position: markerLatLng,
		map: map,
		title: options.name,
		icon: options.icon
	});

	markers.push(marker);
	
	
	//the event listener that activates the infowindow on user click
	google.maps.event.addListener(marker, 'click', function() {
		infowindow.setContent(options.info);
		infowindow.open(map,marker);
	});
}

$(".infowindow_link").live('click', function(){
  window.location.href=this.href;
});