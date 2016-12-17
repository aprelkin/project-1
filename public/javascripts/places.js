$("#btnSave").on('click',function(event){

    var radius = $("#slider-range-min").slider("value");
    var action = JSON.stringify($("#tagsinput").tagsinput('items'));
    var address = $("#search").val();

    $.ajax({
            type: "POST",
            url: "/savePlace",
            data: { state:true,lat: lct.lat, lng: lct.lng, radius : radius, action: action, address:address}
        }).done(function( msg ) {
            $("#savePlaceModal").modal("hide");
        });
});

$("#btnDelete").on('click',function(event){

    var place_id = $("#deletePlaceModal").data('place_id');

    if(typeof place_id !== "undefined")
    {
        $.ajax({
            type: "POST",
            url: "/deletePlace",
            data: { place_id:place_id}
        }).done(function( msg ) {

            var place_id = $("#deletePlaceModal").data('place_id');

            $('#'+place_id).closest('tr').remove();

            $("#deletePlaceModal").modal("hide");
        });
    }
    else {
        var radius = $("#slider-range-min").slider("value");
        var action = JSON.stringify($("#tagsinput").tagsinput('items'));

        $.ajax({
            type: "POST",
            url: "/savePlace",
            data: { state:false,lat: lct.lat, lng: lct.lng, radius : radius, action: action}
        }).done(function( msg ) {
            $("#deletePlaceModal").modal("hide");
        });
    }
});

$("#btnDeleteCancel").on('click',function(event){

    var place_id = $("#deletePlaceModal").data('place_id');

    $('#'+place_id).bootstrapSwitch('state', true, true);
});


$("#custom-switch-05").on('switchChange.bootstrapSwitch',function(event, state){

        if(state)
        {
            $("#savePlaceModal").modal("show");
        }
        else
        {
            $("#deletePlaceModal").modal("show");
        }
});

$(".custom-switch-05").on('switchChange.bootstrapSwitch',function(event, state){

    if(state)
    {
        $("#savePlaceModal").data('place_id', event.target.id).modal("show");
    }
    else
    {
        $("#deletePlaceModal").data('place_id', event.target.id).modal("show");
    }
});