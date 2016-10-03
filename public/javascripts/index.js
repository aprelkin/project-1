$("#slider-range-min").slider({
    range: "min",
    value: 9,
    min: 0,
    max: 10,
    slide: function( event, ui ) {
        $( "#amount" ).val("Umkreis "+ ui.value +" Kilometer");
        var action = JSON.stringify($("#tagsinput").tagsinput('items'));
        look(lct,ui.value,action);
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
});

$('input.tagsinput').on('itemRemoved', function(event) {
    var radius = $("#slider-range-min").slider("value");
    var action = JSON.stringify($("#tagsinput").tagsinput('items'));
    look(lct,radius,action);
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
});

$("#aboutProject").click(function(event){

    $("#showFavorites").css("text-decoration","none");
    $("#showNews").css("text-decoration","none");
    $("#aboutProject").css("text-decoration","underline");
});

lct.lat = !{lat};
lct.lng = !{lng};

// Start point
$(document).ready(function() {
    var radius = 10;
    var action = JSON.stringify($("#tagsinput").tagsinput('items'));
    look(lct,radius,action);
});
$("#btnAnmelden").click({announceID: "!{announceID}"}, function(event){
    location.href = '/login'
})