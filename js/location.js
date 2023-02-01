var directionsDisplay;
	var markersArray = [];
	var markers = [];
    var directionsService = new google.maps.DirectionsService();
    var map;

    function initialize() {
      directionsDisplay = new google.maps.DirectionsRenderer({
      suppressMarkers: true ,
      draggable: true
    });
      var mapOptions = {
        zoom:7,
        center: new google.maps.LatLng(40.71210844487579, -74.00571530793457)
      }
      map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);
      
        
     var trafficLayer = new google.maps.TrafficLayer();
     trafficLayer.setMap(map);            
        
    
        
      directionsDisplay.setMap(map);
      
      $('#ways').on('change', function (e) {
            var optionSelected = $("option:selected", this);
            var valueSelected = this.value;
           calcRoute();
        });
      
      
}
function clearOverlays() {
    console.log("markers.length=" + markers.length);
   for(var i=0; i<markers.length; i++){
        markers[i].setMap(null);   
    }
    markers = null;//Uncaught TypeError: Cannot read property 'push' of null
    //when changed to markers = []; markers flash as if theyve been removed but both sets of markers are now in place, the previous are not removed
}
function handleNoGeolocation(errorFlag) {
  if (errorFlag) {
    var content = 'Error: The Geolocation service failed.';
} else {
    var content = 'Error: Your browser doesn\'t support geolocation.';
}

  var options = {
    map: map,
    position: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
    content: content
  };
  
  

  var infowindow = new google.maps.InfoWindow(options);
  map.setCenter(options.position);
}

function createMarker(latlng, label, html, url) {
    var contentString = '<b>' + label + '</b><br>' + html;
    var marker = new google.maps.Marker({
      position: latlng,
      map: map,
      icon: { 
          url:'data:image/svg+xml;charset=utf-8,' + encodeURIComponent('<svg viewBox="0 0 220 220" xmlns="http://www.w3.org/2000/svg"><circle cx="110" cy="110" r="100" stroke="black" fill="#4E90D9" fill-opacity="1.0" stroke-width="10" /></svg>'),
        size: new google.maps.Size(200, 200),
        scaledSize: new google.maps.Size(32, 32),
        anchor: new google.maps.Point(16, 16),
        labelOrigin: new google.maps.Point(16, 16)
      },
      title: label,
      zIndex: Math.round(latlng.lat() * -100000) << 5
    });
    
    markers.push(marker);
    
     

    google.maps.event.addListener(marker, 'click', function() {
      infowindow.setContent(contentString);
      
      infowindow.open(map, marker);
    });
    
    
    
    return marker;
  }

function computeTotalDistance(result) {
        var total = 0;
        var myroute = result.routes[0];
        for (i = 0; i < myroute.legs.length; i++) {
          total += myroute.legs[i].distance.value;
        }
        total = total / 1000.
        document.getElementById('distance').innerHTML = total + ' km';
    }

function calcRoute() {
    
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          position => {
           console.log(position.coords.latitude);
           console.log(position.coords.longitude);
          },
          error => {
             console.log(error.message);
          }
        );
    } else {
            console.log("Your browser does not support geolocation API ");
    }
    
    if(navigator.geolocation) {
        
      // clearOverlays();
      
      var aya =  $('#ways').find(":selected").val();
       var allData = aya.split("||");
       var lat3 = parseFloat(allData[0]);
       var lon3 = parseFloat(allData[1]); 
        console.log(lat3);
        
        navigator.geolocation.watchPosition(function(position) {
            var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            
            
            
            var request = {
                  origin: pos,
                  destination: new google.maps.LatLng(lat3, lon3),
                  travelMode: google.maps.TravelMode.DRIVING,
                  unitSystem: google.maps.UnitSystem.METRIC,
                  provideRouteAlternatives: true ,
                  region:"ir",//Region to change language
                  drivingOptions: {
                    departureTime: new Date(Date.now() + 10000), // for the time 10000 milliseconds from now.
                    trafficModel: 'bestguess'
                  },
                  durationInTraffic: true ,
                  optimizeWaypoints: true
              };
            directionsService.route(request, function(response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                 // directionsDisplay.setDirections(response);
                  
                        var routes = response.routes;
      var colors = ['red', 'green', 'blue', 'orange', 'yellow'];
      var directionsDisplays = [];

      // Reset the start and end variables to the actual coordinates
      start = response.routes[0].legs[0].start_location;
      end = response.routes[0].legs[0].end_location;
        
        
      
      let dis_total = 0 ;    
      // Loop through each route
      for (var i = 0; i < routes.length; i++) {
        
        var directionsDisplay = new google.maps.DirectionsRenderer({
          map: map,
          suppressMarkers: true ,
          directions: response,
          routeIndex: i,
          draggable: true,
          polylineOptions: {

            strokeColor: colors[i],
            strokeWeight: 4,
            strokeOpacity: .3
          }
        });
        
        
        
        // Push the current renderer to an array
        directionsDisplays.push(directionsDisplay);
        
        

        // Listen for the directions_changed event for each route
        google.maps.event.addListener(directionsDisplay, 'directions_changed', (function(directionsDisplay, i) {
              
              
              
          return function() {
            
            var directions = directionsDisplay.getDirections();
          
            var new_start = directions.routes[0].legs[0].start_location;
            var new_end = directions.routes[0].legs[0].end_location;
             
            

            if ((new_start.toString() !== start.toString()) || (new_end.toString() !== end.toString())) {

              // Remove every route from map
              for (var j = 0; j < directionsDisplays.length; j++) {
                
                directionsDisplays[j].setMap(null);
              }

              // Redraw routes with new start/end coordinates
              plotDirections(new_start, new_end);
              
            }
            
            
          }
        })(directionsDisplay, i)); // End listener
        
      } // End route loop
                  
                  
                  
                  document.getElementById('distance').innerHTML = 'Total travel distance is: ' + (response.routes[0].legs[0].distance.value / 1000).toFixed(2) + " km";
                  
                 var startLocation = new Object();
                 var legs = response.routes[0].legs;
                 startLocation.latlng = legs[0].start_location;
                startLocation.address = legs[0].start_address;
                
                if(typeof(marker) != "undefined") { 
                    directionsDisplay.setPanel(null);
                }else{
                    directionsDisplay.setPanel(document.getElementById("directionsPanel"));
                }
                
                 if (typeof(marker) != "undefined") marker.setMap(null);
                 
                 
                  watchOptions = {
                   enableHighAccuracy: true,
                   timeout: 5000,
                   maximumAge: 0
                 };
                                 
                 /* marker = new google.maps.Marker({
                     position: pos,
                     map: map,
                     title: 'you are here',
                     icon: new google.maps.MarkerImage('https://maps.google.com/mapfiles/ms/micons/blue.png',
                        new google.maps.Size(24,24),
                        new google.maps.Point(0,0)
                       )
                  },watchOptions); */
                  
                  var o = response.routes[0] ;
                  if(o && o.legs)
                    {
                      for(l=0;l<o.legs.length;++l)
                      {
                        var leg=o.legs[l];
                        for(var s=0;s<1;++s)
                        {
                          var step=leg.steps[s],
                              a=(step.lat_lngs.length)?step.lat_lngs[0]:step.start_point,
                              z=(step.lat_lngs.length)?step.lat_lngs[1]:step.end_point,
                              dir=((Math.atan2(z.lng()-a.lng(),z.lat()-a.lat())*180)/Math.PI)+360,
                              ico=((dir-(dir%3))%120);
                              console.log(ico);
                              marker = new google.maps.Marker({
                                position: a,
                                /*icon: new google.maps.MarkerImage('http://maps.google.com/mapfiles/dir_'+ico+'.png',
                                                            new google.maps.Size(24,24),
                                                            new google.maps.Point(0,0)
                                                           ),*/
                                icon: {
                                    //path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                                    path:'M25.395,0H17.636c-3.117,0-5.643,3.467-5.643,6.584v34.804c0,3.116,2.526,5.644,5.643,5.644h11.759' +
                'c3.116,0,5.644-2.527,5.644-5.644V6.584C35.037,3.467,32.511,0,29.395,0z M34.05,14.188v11.665l-2.729,0.351v-4.806L34.05,14.188z' +
                'M32.618,10.773c-1.016,3.9-2.219,8.51-2.219,8.51H16.631l-2.222-8.51C14.41,10.773,23.293,7.755,32.618,10.773z M15.741,21.713' +
                'v4.492l-2.73-0.349V14.502L15.741,21.713z M13.011,37.938V27.579l2.73,0.343v8.196L13.011,37.938z M14.568,40.882l2.218-3.336' +
                'h13.771l2.219,3.336H14.568z M31.321,35.805v-7.872l2.729-0.355v10.048L31.321,35.805z' ,
                                    fillColor: '#ffc30f',
                                    fillOpacity: 1,
                                    scale: 1.5,
                                    strokeColor: 'gray',
                                    strokeWeight: 0.3,
                                    //scale: 4,
                                    //strokeColor: '#00F',
                                    rotation: dir ,
                                    anchor: new google.maps.Point(23,0)
                                } ,                          
                                 map: map,
                                 title: Math.round((dir>360)?dir-360:dir)+'째'
                            });
                
                        }
                      }
                    }
                  
                  
                
                /// createMarker(pos, "start", legs[0].start_address, "green");
                  //fx(response.routes[0]);
                  
                }
            });
            
        },

        function() {
        handleNoGeolocation(true);
        });
    } else {
    // Browser doesn't support Geolocation
        handleNoGeolocation(false);
    }
    
    
    
    

}
function geolocate() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {

            pos = {
            lat: this.position.lat(),
           lng: this.position.lng()
             //   lat: -43.530263,
              //  lng: 172.640236
            };
            
            
            new google.maps.Marker({
                map: map,
                icon: {
                    url: "https://maps.google.com/mapfiles/ms/micons/blue.png",
                    size: new google.maps.Size(24,24),
                    anchor: new google.maps.Point(0,0)
                },
                position: pos
            });

            infoWindow.setPosition(pos);
            infoWindow.setContent('Location found.');
     
            map.setCenter(pos);
            map.setZoom(14);
        }, function () {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
     
    }
     
}
function fx(o){
    
    if(o && o.legs)
    {
      for(l=0;l<o.legs.length;++l)
      {
        var leg=o.legs[l];
        for(var s=0;s<1;++s)
        {
          var step=leg.steps[s],
              a=(step.lat_lngs.length)?step.lat_lngs[0]:step.start_point,
              z=(step.lat_lngs.length)?step.lat_lngs[1]:step.end_point,
              dir=((Math.atan2(z.lng()-a.lng(),z.lat()-a.lat())*180)/Math.PI)+360,
              ico=((dir-(dir%3))%120);
              markers.push(new google.maps.Marker({
                position: a,
                icon: new google.maps.MarkerImage('http://maps.google.com/mapfiles/dir_'+ico+'.png',
                                            new google.maps.Size(24,24),
                                            new google.maps.Point(0,0)
                                           ),
                 map: map,
                 title: Math.round((dir>360)?dir-360:dir)+'째'
            }));

        }
      }
    }
    
  }

google.maps.event.addDomListener(window, 'load', initialize);