$('input').prop('disabled', true);
$("document").ready(function() {

    if($('#statusbar').attr('status') == 3)
    {
        setTimeout(function () {
            location.href = '/'
        }, 1000);
    }
    $('input').prop('disabled', false);

});