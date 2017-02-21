var lct = new Object;
    lct.lat = 0;
    lct.lng = 0;
    lct.radius = 0;

var announceID = 0;

var skip = 10;

var scrollON = true;


var opts = {
    lines: 13, // The number of lines to draw
    length: 20, // The length of each line
    width: 10, // The line thickness
    radius: 30, // The radius of the inner circle
    corners: 1, // Corner roundness (0..1)
    rotate: 0, // The rotation offset
    direction: 1, // 1: clockwise, -1: counterclockwise
    color: '#000', // #rgb or #rrggbb or array of colors
    speed: 1, // Rounds per second
    trail: 60, // Afterglow percentage
    shadow: false, // Whether to render a shadow
    hwaccel: false, // Whether to use hardware acceleration
    className: 'spinner', // The CSS class to assign to the spinner
    zIndex: 2e9, // The z-index (defaults to 2000000000)
    top: 'auto', // Top position relative to parent in px
    left: 'auto' // Left position relative to parent in px
};

var opts_small = {
    lines: 11, // The number of lines to draw
    length: 0, // The length of each line
    width: 10, // The line thickness
    radius: 19, // The radius of the inner circle
    corners: 1, // Corner roundness (0..1)
    rotate: 90, // The rotation offset
    direction: 1, // 1: clockwise, -1: counterclockwise
    color: '#000', // #rgb or #rrggbb or array of colors
    speed: 0.9, // Rounds per second
    trail: 42, // Afterglow percentage
    shadow: false, // Whether to render a shadow
    hwaccel: false, // Whether to use hardware acceleration
    className: 'spinner', // The CSS class to assign to the spinner
    zIndex: 2e9, // The z-index (defaults to 2000000000)
    top: 17, // Top position relative to parent in px
    left: 45 // Left position relative to parent in px
};

var opts_login = {
    lines: 11, // The number of lines to draw
    length: 0, // The length of each line
    width: 10, // The line thickness
    radius: 19, // The radius of the inner circle
    corners: 1, // Corner roundness (0..1)
    rotate: 90, // The rotation offset
    direction: 1, // 1: clockwise, -1: counterclockwise
    color: '#000', // #rgb or #rrggbb or array of colors
    speed: 0.9, // Rounds per second
    trail: 42, // Afterglow percentage
    shadow: false, // Whether to render a shadow
    hwaccel: false, // Whether to use hardware acceleration
    className: 'spinner', // The CSS class to assign to the spinner
    zIndex: 2e9, // The z-index (defaults to 2000000000)
    top:'auto', // Top position relative to parent in px
    left: 'auto' // Left position relative to parent in px
};

var makem = new Object;

    makem.top = 0;
    makem.m = 0;
    makem.rows = 0;
    makem.rightSide = 0;
    makem.rightSide0row = 0;
    makem.clean = function()
    {
        makem.top = 0;
        makem.m = 0;
        makem.rows = 0;
        makem.rightSide = 0;
        makem.rightSide0row = 0;
    }






