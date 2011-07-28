/*
  Animating a path on a Google Map by Christian Heilmann
  Homepage: http://isithackday.com/spirit-of-indiana/map.html
  Copyright (c)2010 Christian Heilmann
  Code licensed under the BSD License:
  http://wait-till-i.com/license.txt
*/
  var spirit = {};

// Init function
spirit.initialize = function(start){
    $("#mapcanvas").fadeIn('slow');
    
	var end = generateAntipode(start);	



/* Define start and end points */
        var startpos = new google.maps.LatLng(start[0],start[1]),
        endpos = new google.maps.LatLng(end[0],end[1]),
        mapelm = document.getElementById('mapcanvas');


/* Draw map */
   var map = new google.maps.Map(
                mapelm,
                {
                  disableDefaultUI:true,
                  zoom: 2,
                  center: new google.maps.LatLng(start[0],start[1]),
                  mapTypeId: google.maps.MapTypeId.TERRAIN
                });
    var markernyc = new google.maps.Marker({
         position: startpos, 
         map:map, 
         title:'Start'
     });
     var markerparis = new google.maps.Marker({
          position:endpos, 
          map:map, 
          title:'Other side of the world'
     });
        
        
/* Assume 30 animation frames and calculate the necessary increase */
     var animationstart = 0,
         animationend = 30,
         now = animationstart,
         amount = animationend - animationstart,
         pos = [],
         addx = (end[0] - start[0]) / amount,
         addy = (end[1] - start[1]) / amount,
         i,full,path;
        
/* Calculate the points and seed the array */        
    for(i=animationstart;i<animationend;i++){
      pos[i] = new google.maps.LatLng(start[0] += addx,start[1] += addy);
    }

/* Once all tiles have loaded, start the animation */
    google.maps.event.addListener(map,'tilesloaded',function(){
      spirit.draw();
    },false);

/* Recursive method to draw the line and move the map*/
    spirit.draw = function(){
      var path = new google.maps.Polyline({
            path: [startpos,pos[now]],
            strokeColor:'#c00',
            strokeOpacity:0.7,
            strokeWeight:10
      });
      path.setMap(map);
      map.panTo(pos[now]);
      now = now + 1;
      if(now < animationend-1){
        setTimeout(spirit.draw,200);
      }
    };
  };


// Cian's code
  
window.addEventListener('load',function(){


$("form#addressSearch").submit(function() { // On submit, do a post to the geocoding service
	var fieldContents = $('#address').attr('value');
	$("#shovel").fadeOut('slow');
	
	
     jQuery.ajax({  
         dataType: 'jsonp',  
         url: 'http://maps.google.com/maps/geo?output=json&oe=utf8&sensor=false'  
                 + '&key=' + "ABQIAAAAssW_vpKQ26cxNvwYJwawxhRfE1OiJsFEVQye51YG_jpt6ESfXRTLPuoUe17PpVZ68DqnDVoljH0U2A" + '&q=' + fieldContents,  
         cache: false,  
         success: function(data){  
         	// If we get data back - set our map to animate to the antipode
            if(data.Status.code==200) {  
				$("#error").html("");
                 var result = {};  
                 result.longitude = data.Placemark[0].Point.coordinates[0];  
                 result.latitude = data.Placemark[0].Point.coordinates[1];  
                 
	                 var start = [result.latitude, result.longitude];
                 
					 spirit.initialize(start);
             } else {  
				// error
				$("#error").html("Er, where..?");
             }  
         }  
       });  
	
	
	return false;
});
	
	
	
  
	$("a#show-panel").click(function(){
		$("#lightbox, #about-panel").fadeIn(300);
	})
	$("a#close-panel").click(function(){
		$("#lightbox, #about-panel").fadeOut(300);

	})

  
	
  }, false);  
  
  
function generateAntipode(start){
	var endLat = start[0] * -1;
	var endLong = (start[1]>0) ? start[1]-180 : start[1] + 180;
	var end = [endLat, endLong];
	return end;
}
