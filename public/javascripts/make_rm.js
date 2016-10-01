
function make(announcements)
{
    var textLimit = 310;

    var top = makem.top;
    var m = makem.m;
    var rows = makem.rows;
    var rightSide = makem.rightSide;
    var rightSide0row = makem.rightSide0row;

    for (var i = 0; i < announcements.length; i++)
    {
        var div = document.createElement('div');
        var innerDiv = document.createElement('div');
        var textDiv = document.createElement('div');

        $(innerDiv).addClass("pinbottom");
        $(innerDiv).appendTo($(div));

        var spanTopA = document.createElement('span')

            $(spanTopA).addClass("btn btn-info");
            $(spanTopA).attr("id",announcements[i]._id);
            $(spanTopA).addClass("pinButton");
            $(spanTopA).addClass("img");

        var spanBottomA = document.createElement('span')
            $(spanBottomA).addClass("fui-image");
            $(spanBottomA).appendTo($(spanTopA));

            $(spanTopA).appendTo($(innerDiv));

        var spanTopB = document.createElement('span')

            $(spanTopB).addClass("btn btn-info margin-left-3px");
            $(spanTopB).attr("lat",announcements[i].lat);
            $(spanTopB).attr("lng",announcements[i].lng);
            $(spanTopB).attr("imgLength",announcements[i].imgLength);
            $(spanTopB).addClass("pinButton");
            $(spanTopB).addClass("map");

        var spanBottomB = document.createElement('span')
            $(spanBottomB).addClass("fui-location");
            $(spanBottomB).appendTo($(spanTopB));

            $(spanTopB).appendTo($(innerDiv));

        var points = "";

        if(announcements[i].announcement.length >= textLimit)
        {
            points = "..";
        }

        var text = announcements[i].announcement.substr(0, 310)+points;
        var textAdd = announcements[i].announcement.substr(310, 1000);

        $(textDiv).append(text);
        $(textDiv).attr("textAdd", textAdd);
        $(textDiv).addClass("textDiv");
        $(div).append(textDiv);
        $(div).addClass("pin");
        $(div).appendTo($(".wrapper"));

        var left = m*$(div).width() + m*65;

        rightSide0row = (m)*$(div).width() + (m)*65 +$(div).outerWidth();

        if(left > $( window ).width() - 350 )
        {
            if(rightSide == 0)
            {
                rightSide = (m-1)*$(div).width() + (m-1)*65 +$(div).outerWidth();
            }
            m = 0;
            left = m*$(div).width() + m*65;
            top = top + $(div).height() + 70;
            rows++;
        }

        if (top > $( window ).height()+ 300)
        {
            //break;
        }

        var randomColor = Math.floor((Math.random()*8)+1);

        $(div).css("top", top);
        $(div).addClass("pin"+randomColor);
        $(div).css("left", left);

        m++;
    }

    $(".pin").mouseout(function() {

        var opacity = 0.8;

        var rgbColor = $(this).css('backgroundColor');
        var lastComma = rgbColor.lastIndexOf(',');
        var newColor = rgbColor.slice(0, lastComma + 1) + opacity + ")";
        $(this).animate({'background-color':newColor},{duration:200});
    });
    $(".pin").mouseover(function() {

        var opacity = 0.99;

        var rgbColor = $(this).css('backgroundColor');
        var lastComma = rgbColor.lastIndexOf(',');
        var newColor = rgbColor.slice(0, lastComma + 1) + opacity + ")";
        $(this).animate({'background-color':newColor},{duration:200});
    });

    var shift = ($( window ).width() - rightSide)/2;

    if(rows == 0)
    {
        shift = 50;
        $(".footer").css("top", $(window).height()-50);
    }
    else
    {
        $(".footer").css("top",top+550);
    }

    $(".wrapper").css("margin-left", shift)


    makem.top = top;
    makem.m = m;
    makem.rows = rows;
    makem.rightSide = rightSide;
    makem.rightSide0row = rightSide0row;
}


