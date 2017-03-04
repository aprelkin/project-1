/**
 * Created by sandrafernandamahechaespana on 09/03/15.
 */


function createPinitems(announcements){

    var template = $(".grid .row .item").first();

    var isAllannoucements = false;

    for (var i = 0; i < announcements.length; i++)
    {
        var div = template.clone();

        $(div).removeClass("display-none");

        var userName = announcements[i].name;
        var text = announcements[i].rest.announcement;
        var time = announcements[i].time;
        var announceID = announcements[i].rest._id;
        var address = announcements[i].rest.address;
        var source = announcements[i].source==1?"fui-facebook":announcements[i].source==2?"fui-twitter":announcements[i].source==3?"fui-google-plus":"";

        isAllannoucements = announcements[i].isAllannouncements;

        $(div).attr('id',announceID);
        
        $(div).find(".well p").not(".well-top p").empty().append(text);
        $(div).find(".well-top .source").addClass(source);
        $(div).find(".well-top .a-top").empty().append(userName+" am "+time+" hat gepostet");
        
        //$(div).find(".well-top .a-top").attr("href","/news?id="+announceID);

        $(div).find(".well-top .a-top").click({userID: announcements[i].rest.userID}, function(event){

            event.preventDefault();
            
            findByUserId(event.data.userID);
        });

        $(div).find(".imageWrapper").empty();
        $(div).find(".address").empty().append(address);

        $(div).find(".address").click({lat: announcements[i].rest.lat, lng: announcements[i].rest.lng }, function(event){
            
            event.preventDefault();

            findByAddress(event.data.lat, event.data.lng);
        });


        $.each( announcements[i].rest.imgs, function( index, value ){

            var parameters;

            if(index == 0)
            {
                parameters = "class='slideImg imgMaster'";
            }
            else
            {
                parameters = "class='slideImg imgSlave'";
            }

            $(div).find(".imageWrapper").append("<img src='/images/mini/"+value+"' "+parameters+">");

            /*******************************************************
            / Add one more photo makes possible to show slider
            /*******************************************************/
            if(announcements[i].rest.imgs.length == 1)
            {
                parameters = "class='slideImg imgSlave'";
                $(div).find(".imageWrapper").append("<img src='/images/mini/"+value+"' "+parameters+">");
            }
        });

        $(div).find(".slideImg").click(function () {

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

        $(div).find(".fav").find("span").empty().text(announcements[i].favCount);

        if(announcements[i].fav==1)
        {
            $(div).find(".fav").find("span").addClass("starred");
        }

        $(div).find(".fav").click({announceID: announceID},function(event) {

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

                    var span = $("#"+id).find(".fav").find("span");
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
                else
                {
                    $("#anmeldenModal").modal("show");
                }
            });
        } )

        $(div).find(".chat").click(function(event) {

            event.preventDefault();

            // TODO CHAT
            alert("chat");
        } )

        $(div).appendTo(".grid .row");
    }
    
    if(isAllannoucements)
    {
        $("#alert").removeClass("display-none");
        $("#alert").find("p").empty().html("Es wurde an deinem Ort keine Nachriche gefunden. Willst Du bei deinem Ort der Erste sein? Dann kannst Du eine neue Nachricht <a href='/put?lat="+lct.lat +"&lng="+lct.lng+"' class='aler-link'>schreiben</a>.")
    }
    else
    {
        $("#alert").addClass("display-none");
    }
}
