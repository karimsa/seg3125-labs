window.jQuery(function($) {
    $('.card[data-service]').each(function(_, card) {
        $(card).on('click', function(evt) {
            $('select[name="service"]').val(
                $(card).attr('data-service')
            )
            $('html').animate({
                scrollTop: $('#booking').offset().top,
            })
        })
    })
})
