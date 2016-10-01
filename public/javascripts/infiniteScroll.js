

function infiniteScroll()
{
    var scrollBottom = $(document).height() -  parseInt($(window).scrollTop()+$(window).height());

    if(scrollBottom < 300 && scrollBottom > 100)
    {
        scrollON = true;
    }

    if(scrollBottom < 100 && scrollON )
    {
            scrollON = false;
            $.ajax({
                type: "POST",
                url: "/look",
                data: { lat: lct.lat, lng: lct.lng, skip: skip }
            })
                .done(function( msg ) {
                    make(msg);
                    skip += 10;
                    setImageButton();
                    setMapButton();
                    onClickPin();
                });

    }
}
