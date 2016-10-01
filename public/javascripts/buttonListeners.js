function setImageButton()
{
    var pbList = $(document).find(".pinButton.img");

    var m = new Array()

    for (var i = 0; i < pbList.length; i++) {
        pbList[i].addEventListener('click', function() {

            var id = this.id;

            if (typeof m[id] === 'undefined' || m === null){
                m[id] = 0;
            }

            var elem = $(this).parent().parent();

            elem.find(".gm-style").remove(); // remove google map style
            elem.css("background-color",""); // remove google map style
            elem.find(".textDiv").fadeTo(1, 0);


            var spinner = new Spinner(opts).spin(this.parentNode.parentNode);

            var img = new Image();
            img.src = $(location).attr('href').replace("#","")+"images/mini/"+id+"_pic_"+m[id]+".jpg";

            $(img).error(function(){
                elem.find(".textDiv").fadeTo(0, 1);
                elem.css("backgroundImage","");
                spinner.stop();
                m[id] = 0;
            });

            $(img).load(function(){
                spinner.stop();
                elem.css("backgroundImage","url('/images/mini/"+id+"_pic_"+m[id]+".jpg')");
                m[id]++;
            });
        });
    }
}

function setMapButton()
{
    var pbList = $(document).find(".pinButton.map");

    for (var i = 0; i < pbList.length; i++) {
        pbList[i].addEventListener('click', function() {

            var myLatlng = new google.maps.LatLng($(this).attr("lat"), $(this).attr("lng"));

            var mapOptions = {
                center: myLatlng,
                zoom: 15,
                noClear:true,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            var map = new google.maps.Map(this.parentNode.parentNode,
                mapOptions);

            var marker = new google.maps.Marker({
                position: myLatlng,
                map: map,
                title: 'Hello World!',
                draggable:false
            });
        });
    }
}


