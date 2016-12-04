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

    var radius = $("#slider-range-min").slider("value");
    var action = JSON.stringify($("#tagsinput").tagsinput('items'));

    $.ajax({
        type: "POST",
        url: "/savePlace",
        data: { state:false,lat: lct.lat, lng: lct.lng, radius : radius, action: action}
    }).done(function( msg ) {
        $("#deletePlaceModal").modal("hide");
    });
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