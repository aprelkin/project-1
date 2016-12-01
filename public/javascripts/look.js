
// Initialize Google Map

google.maps.event.addDomListener(window, 'load', initialize);
var geocoder = new google.maps.Geocoder();

function initialize() {

    var input = document.getElementById('search');
    var searchBox = new google.maps.places.SearchBox(input);

    /**
     * using just for main page
     */
    if($('#search').hasClass("main-page")) {

        geocoder.geocode({'location': new google.maps.LatLng(lct.lat, lct.lng)}, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                if (results[1]) {

                    $('#search').val(results[1].formatted_address);

                } else {
                    alert('No results found');
                }
            } else {
                alert('Geocoder failed due to: ' + status);
            }
        });
    }

    // The place was changed
    google.maps.event.addListener(searchBox, 'places_changed', function() {

        var places = searchBox.getPlaces();

        lct.lat = places[0].geometry.location.lat();
        lct.lng = places[0].geometry.location.lng();

        var radius = $("#slider-range-min").slider("value");

        var action = JSON.stringify($("#tagsinput").tagsinput('items'));

        // look for saved news
        look(lct,radius,action);
        isIamfollow(lct,radius,action);
    });
}

function look(lct,radius,action)
{
     $.ajax({
        type: "POST",
        url: "/look",
        data: { lat: lct.lat, lng: lct.lng, skip: 0, radius : radius, action: action}
    }).done(function( msg ) {
        $(".item").not(".display-none").remove();
        createPinitems(msg);
    });
}

function isIamfollow(lct,radius,action)
{
    $.ajax({
        type: "POST",
        url: "/findPlace",
        data: { lat: lct.lat, lng: lct.lng, radius : radius, action: action}
    }).done(function( msg ) {

            $("#custom-switch-05").bootstrapSwitch('state', true, true);

    }).fail(function (jqXHR, textStatus) {

        $("#custom-switch-05").bootstrapSwitch('state', false, true);
    });
}

function showMyFavarites()
{
    $.ajax({
        type: "POST",
        url: "/showMyFavarites"
    }).done(function( msg ) {

        if(!jQuery.isEmptyObject(msg))
        {
            $(".item").not(".display-none").remove();
            createPinitems(msg);
        }
        else
        {
            $(".item").not(".display-none, #alert").remove();
            $(".alert").find("p").empty().text("Du hast noch keine Favoriten");
        }

    });
}


