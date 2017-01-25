$("#slider-range-min").slider({
    range: "min",
    value: 9,
    min: 0,
    max: 10,
    slide: function( event, ui ) {
        $( "#amount" ).val("Umkreis "+ ui.value +" Kilometer");
        var action = JSON.stringify($("#tagsinput").tagsinput('items'));
        look(lct,ui.value,action);
        isIamfollow(lct,ui.value,action);

    }}).addSliderSegments();

$( "#amount" ).val("Umkreis "+ $( "#slider-range-min" ).slider( "value" ) +" Kilometer");

$('input.tagsinput').tagsinput({trimValue: true, confirmKeys: [13, 32], onBlur:true});

$('input.tagsinput-typeahead').tagsinput('input').typeahead(null, {

    displayKey: 'word',

    source: function (query, process) {
        return $.get('typeahead', { query: query }, function (data) {
            return process(data);
        });
    }
});

$('input.tagsinput').on('itemAdded', function(event) {
    var radius = $("#slider-range-min").slider("value");
    var action = JSON.stringify($("#tagsinput").tagsinput('items'));
    look(lct,radius,action);
    isIamfollow(lct,radius,action);
});

$('input.tagsinput').on('itemRemoved', function(event) {
    var radius = $("#slider-range-min").slider("value");
    var action = JSON.stringify($("#tagsinput").tagsinput('items'));
    look(lct,radius,action);
    isIamfollow(lct,radius,action);
});

$("#showFavorites").click(function(event){
    event.preventDefault();
    $("#showNews").css("text-decoration","none");
    $("#aboutProject").css("text-decoration","none");
    $("#showFavorites").css("text-decoration","underline");

    showMyFavarites();
});

$("#showNews").click(function(event){
    event.preventDefault();
    $("#showFavorites").css("text-decoration","none");
    $("#aboutProject").css("text-decoration","none");
    $("#showNews").css("text-decoration","underline");

    var radius = $("#slider-range-min").slider("value");
    var action = JSON.stringify($("#tagsinput").tagsinput('items'));
    look(lct,radius,action);
    isIamfollow(lct,radius,action);
});

$("#aboutProject").click(function(event){

    $("#showFavorites").css("text-decoration","none");
    $("#showNews").css("text-decoration","none");
    $("#aboutProject").css("text-decoration","underline");
});

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

$("#btnDeleteCancel").on('click',function(event){

       $("#custom-switch-05").bootstrapSwitch('state', true, true);
});

$("#btnSaveCancel").on('click',function(event){

    $("#custom-switch-05").bootstrapSwitch('state', false, true);
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


$("#custom-switch-04").on('switchChange.bootstrapSwitch',function(event, state){

    $("#anmeldenModal").modal("show");

    setTimeout(function(){ $("#custom-switch-04").bootstrapSwitch('state', false, true); }, 500);
});

// Start point
$(document).ready(function() {
    
    // get initial location from IP maxmind database
    lct.lat = $("#lat").attr("value");
    lct.lng = $("#lng").attr("value");

    var radius = $("#slider-range-min").slider("value");
    var action = JSON.stringify($("#tagsinput").tagsinput('items'));

    look(lct,radius,action);
    isIamfollow(lct,radius,action);
});

$("#btnAnmelden").click({announceID: "!{announceID}"}, function(event){
    location.href = '/login'
})