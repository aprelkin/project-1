function onClickPin()
{
    $(".pin").unbind( "click" );

    $( ".pin" ).bind( "click", function(event) {

            if($(event.target).hasClass("textDiv")||$(event.target).hasClass("pin"))
            {
                var ta = event.target;
                if($(event.target).hasClass("textDiv"))
                {
                    ta = event.target.parentNode;
                }
                modalWindow(ta);
            }
        });

    $(window).scroll(function(){
        $(".modal").remove();
        $(".modalAnnounce").remove();
        $(".imgContainer").remove();
        $(".textContainer").remove();
        $(".imgOver").remove();
    })
}

function modalWindow(target)
{
   var color = getComputedStyle(target).backgroundColor;

    var lat = $(target).find(".pinButton.map").attr("lat");
    var lng = $(target).find(".pinButton.map").attr("lng");
    var id = $(target).find(".pinButton.img").attr("id");
    var text = $(target).find(".textDiv").text();
    var textAdd = $(target).find(".textDiv").attr("textAdd");
    var imgLength = $(target).find(".pinButton.map").attr("imgLength");

    if($(target).hasClass("textDiv")){
        color = getComputedStyle(target.parentNode).backgroundColor;
        lat = $(target).parent().find(".pinButton.map").attr("lat");
        lng = $(target).parent().find(".pinButton.map").attr("lng");
        text = $(target).parent().find(".textDiv").text();
        textAdd = $(target).parent().find(".textDiv").attr("textAdd");
        imgLength = $(target).parent().find(".pinButton.map").attr("imgLength");
    }

    text = text.substr(0,text.length-2)+textAdd;

    var modal=document.createElement("div");
    $(modal).addClass("modal");
    $(modal).css("top", $(window).scrollTop());
    $(modal).css("backgroundColor",color);
    $(modal).click(function() {
        $(modal).remove();
        $(announcement).remove();
        $(imgContainer).remove();
        $(textContainer).remove();
        $(".imgOver").remove();
    });

    var close=document.createElement("button");
    $(close).addClass("close fui-cross-inverted shift");
    $(close).appendTo(modal);


    var announcement = document.createElement("div");
    $(announcement).addClass("modalAnnounce");
    $(announcement).css("backgroundColor",color);
    $(announcement).css("top",$(window).scrollTop()+50);

    var imgContainer = document.createElement("div");
    $(imgContainer).addClass("imgContainer");


    $(imgContainer).mouseover(function(){

        if ($(".imgOver").length >0 ) {
            $(".imgOver").fadeIn(300)
        }
        else
        {
            var imgOver = document.createElement("div");
            $(imgOver).addClass("imgOver");
            $(imgOver).css("backgroundColor",color);
            $(imgOver).css("top",$(window).scrollTop()+375);

            for(var i=0; i < imgLength; i++)
            {
                var imgDiv = document.createElement("div");
                $(imgDiv).addClass("imgDiv");
                $(imgDiv).css("left",i*152+5);
                $(imgDiv).attr("id","img_"+id+"_"+i+"_");

                var spinner = new Spinner(opts_small).spin(imgDiv);

                var img = document.createElement("img");
                $(img).addClass("imgDiv");
                $(img).css("left",i*152+5);
                $(img).attr("src","/images/mini/"+id+"_pic_"+i+".jpg");
                $(img).attr("id","img_"+id+"_"+i);

                $(img).load(function() {
                    $("#"+$(this).attr("id")+"_").remove();
                });

                $(img).mouseover(function(){
                    $("body").find(".gm-style").fadeOut(300); // remove google map style
                    $(imgContainer).css("background-color",""); // remove google map style
                    $(imgContainer).css("backgroundImage","url('"+$(this).attr("src")+"')");
                });

                $(img).appendTo(imgOver);
                $(imgDiv).appendTo(imgOver);
            }

            $("body").append(imgOver);
        }
    })

    $(announcement).mouseover(function(){
        $(".imgOver").fadeOut(300);
        $("body").find(".gm-style").fadeIn(300);
    })

    var textContainer = document.createElement("div");
    $(textContainer).text(text);
    $(textContainer).addClass("textContainer");
    $(textContainer).css("top",$(window).scrollTop()+520);

    $("body").append(modal);
    $("body").append(announcement);
    $("body").append(imgContainer);
    $("body").append(textContainer);

    var myLatlng = new google.maps.LatLng(lat, lng);

    var mapOptions = {
        center: myLatlng,
        zoom: 15,
        overviewMapControl:true,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(imgContainer,
        mapOptions);

    var marker = new google.maps.Marker({
        position: myLatlng,
        map: map,
        title: 'Hello World!',
        draggable:false
    });

    google.maps.event.addListener(map, 'idle', function(){
        $(".imgContainer").css("position","absolute");
        $(".imgContainer").css("top",$(window).scrollTop()+75);
        $("body").find(".gm-style").css("display","inline")
    });

    imgLoad(id, 0);
}