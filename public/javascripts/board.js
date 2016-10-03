$('input.tagsinput').tagsinput({trimValue: true, confirmKeys: [13, 32], onBlur:true});

$('input.tagsinput-typeahead').tagsinput('input').typeahead(null, {

    displayKey: 'word',

    source: function (query, process) {
        return $.get('typeahead', { query: query }, function (data) {
            return process(data);
        });
    }
});

$(document).ready(function() {

    // get initial location from IP maxmind database
    lct.lat = $("#lat").attr("value");
    lct.lng = $("#lng").attr("value");
});