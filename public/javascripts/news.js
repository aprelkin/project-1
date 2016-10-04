
$( "#slider-range-min" ).slider({
    range: "min",
    value: 1,
    min: 0,
    max: 10,
    slide: function( event, ui ) {
        $( "#amount" ).val("Umkreis "+ ui.value +" Kilometer");
        var action = JSON.stringify($("#tagsinput").tagsinput('items'));
        look(lct,ui.value,action);
    }}).addSliderSegments();

$( "#amount" ).val("Umkreis "+ $( "#slider-range-min" ).slider( "value" ) +" Kilometer");

$('input.tagsinput').tagsinput({trimValue: true});

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

$('input').on('itemRemoved', function(event) {
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

$(".imageWrapper").find(".slideImg").click(function () {

    $(this).hide("slide", { direction: "up" }, 500, function() {
        $(this).removeClass("imgMaster").addClass("imgSlave");
    });

    var next = $(this).parent().next();

    if(next.length == 0)
    {
        next = $(this).parent().prevAll(':last');
    }

    next.show("slide", { direction: "down" }, 500, function() {
        $(this).removeClass("imgSlave").addClass("imgMaster");
    });
});

$(".fav").click({announceID: "!{announceID}"},function(event) {

    event.preventDefault();

    $.ajax({
        type: "POST",
        url: "/fav",
        data: { announceid: event.data.announceID}
    }).done(function( msg ) {

        if(typeof msg[2] !== "undefined")
        {

            var id = msg[2].announceID;
            var size = msg[1].size;

            var span = $(".fav").find("span");
            span.empty().text(size);
            if(msg[0].status == 1)
            {
                span.addClass("starred");
            }
            else
            {
                span.removeClass("starred");
            }
        }

    });
} )


$("#btnDelete").click({announceID: "!{announceID}"}, function(event){

    $.ajax({
        type: "POST",
        url: "/delete",
        data: { announceid: event.data.announceID}
    }).done(function( msg ) {

        $(".modal-title").empty().text("Die Nachricht wurde gelöscht");
        $("#btnDelete").remove();
        $("#btnAbbrechen").remove();
        setTimeout(function () {
            location.href = '/'
        }, 1000);
    });
})
$("#btnAnmelden").click({announceID: "!{announceID}"}, function(event){
    location.href = '/login'
})

$("#editOver").mouseover(function(){
    $("#edit").addClass("display-block");
    $("#edit").css("cursor","pointer");
})
$("#editOver").mouseout(function(){
    $("#edit").removeClass("display-block");
})

$("#editOver").dblclick(function(){
    editTextArea();
})

$("#edit").click(function(){
    editTextArea();
})

$("#message").blur({announceID: "!{announceID}"}, function(event){

    alert("dsds: "+event.data.announceID);

    hideTextArea(event.data.announceID);
})

function editTextArea()
{
    $("#message-holder").removeClass("display-none");
    var text = $("#editOver").closest("div").find("p").text();
    $("#message").text(text).focus();
    $("#editOver").hide();
}
function hideTextArea(announceID)
{
    $("#editOver").show();
    var text = $("#message").val();
    $("#editOver").closest("div").find("p").text(text);
    $("#message-holder").addClass("display-none");

    updateText(announceID, text);
}

function updateText(announceID,text)
{
    $.ajax({
        type: "POST",
        url: "/update",
        data: { announceid: announceID, text: text}
    });
}

$(document).ready(function() {

    // get initial location from IP maxmind database
    lct.lat = $("#lat").attr("value");
    lct.lng = $("#lng").attr("value");
});
