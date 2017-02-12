function initialize() {

    var markers = [];

    var myLatlng = new google.maps.LatLng(lct.lat, lct.lng);

    var mapOptions = {
        center: myLatlng,
        zoom: 14,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(document.getElementById("map-canvas"),
        mapOptions);

    var marker = new google.maps.Marker({
        position: myLatlng,
        map: map,
        title: 'Hello World!',
        draggable:true
    });

    markers.push(marker);

    var button = document.getElementById("btnSave");
    button.addEventListener('click', function() {


    $("#saveModal").find(".modal-title").text("Nachricht wird gespeichert..");

    $("#saveModal").find("#btnSave").prop("disabled", true);
    $("#saveModal").find("#btnAbbrechen").prop("disabled", true);


    var spinner = new Spinner().spin();

    $("#saveModal").find("#btnSpin").append(spinner.el);

    var imgs = document.querySelectorAll(".obj");

    var fd = new FormData();
    var markerPosition = markers[0].getPosition();
    var message = document.getElementById("message");
    var address = document.getElementById("target");

    var action = JSON.stringify($("#tagsinput").tagsinput('items'));
    var url = "/save";
     
    // there are two lat, lng input: one from ip, anoter from google map marker
    // to avoid inconsistency fix value till 3 sign after comma
        
    var lat = parseFloat(markerPosition.lat()).toFixed(3);
    var lng = parseFloat(markerPosition.lng()).toFixed(3);
        
    fd.append("position", markerPosition);
    fd.append("lat", lat);
    fd.append("lng", lng);
    fd.append("announcement", message.value);
    fd.append("action", action);
    fd.append("address",address.value);

    for(var i = 0; i < imgs.length; i++)
    {
      fd.append("img",imgs[i].file);
    }

    var http = new XMLHttpRequest();
    http.open("POST", url, true);

    http.overrideMimeType('text/plain; charset=x-user-defined-binary');

    http.onreadystatechange = function() {
       if(http.readyState == 4 && http.status == 200) {

                setTimeout(function(){window.location = "/"}, 3000);
            }
        }

    http.upload.addEventListener("progress", function (event) {

        var percent = (event.loaded / event.total) * 100;
        //percent variable can be used for modifying the length of your progress bar.
        $("#saveModal").find(".modal-progress-bar").text(parseInt(percent) +"%");
    });

    http.send(fd);
    });

    var input = document.getElementById('target');
    var searchBox = new google.maps.places.SearchBox(input);

    google.maps.event.addListener(searchBox, 'places_changed', function() {

        var places = searchBox.getPlaces();

        for (var i = 0, marker; marker = markers[i]; i++) {
            marker.setMap(null);
        }

        markers = [];
        var bounds = new google.maps.LatLngBounds();
        for (var i = 0, place; place = places[i]; i++) {
            // icon http://maps.gstatic.com/mapfiles/place_api/icons/geocode-71.png

                var marker = new google.maps.Marker({
                map: map,
                title: place.name,
                position: place.geometry.location,
                draggable:true
            });

            markers.push(marker);
            bounds.extend(place.geometry.location);
        }
        map.fitBounds(bounds);
        map.setZoom(16);
    });

    google.maps.event.addListener(map, 'bounds_changed', function() {
        var bounds = map.getBounds();
        searchBox.setBounds(bounds);
    });

    geocoder.geocode({'location': myLatlng}, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            if (results[1]) {

                $('#target').val(results[1].formatted_address);

            } else {
                alert('No results found');
            }
        } else {
            alert('Geocoder failed due to: ' + status);
        }
    });
}

google.maps.event.addDomListener(window, 'load', initialize);
var geocoder = new google.maps.Geocoder();

