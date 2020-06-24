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

    var validityChecks = window.validityChecks = {
        name: false,
        phoneNumber: false,
        date: false,
        cardNumber: false,
        cvc: false,
        expiry: false,
    }

    var personName = $('[name="fullName"]')
    var phoneNumber = $('[name="phoneNumber"]')
    var dateInput = $('[name="date"]')
    var timeInput = $('[name="time"]')

    // Credit card input
    var cardNo = $('[name="cardNo"]')
    var cardCvc = $('[name="cvc"]')
    var cardExpiry = $('[name="cardExpiry"]')

    function setValidState(name, target, isNeutral, isValid, errorText) {
        try {
            validityChecks[name] = isValid
            var isFormValid = true

            for (var key in validityChecks) {
                if (validityChecks.hasOwnProperty(key) && !validityChecks[key]) {
                    isFormValid = false
                    break
                }
            }

            if (isFormValid) {
                $('#booking-submit')
                    .removeAttr('disabled')
            } else {
                $('#booking-submit')
                    .attr('disabled', 'true')
            }

            if (target) {
                if (isNeutral) {
                    target
                        .removeClass('is-valid')
                        .removeClass('is-invalid')
                        .tooltip('dispose')
                } else if (isValid) {
                    target
                        .addClass('is-valid')
                        .removeClass('is-invalid')
                        .tooltip('dispose')
                } else {
                    target
                        .addClass('is-invalid')
                        .removeClass('is-valid')
                        .attr('title', errorText)
                        .tooltip()
                }
            }
        } catch (e) {}
    }

    function onNameUpdate() {
        var val = personName.val().replace(/[0-9,+\-=\./;:'"\[\]\{\}\|!@#$%^&\*\(\)`~\\]+/g, '')
        if (val !== personName.val()) {
            personName.val(val)
        }

        setValidState(
            'name',
            personName,
            !val,
            val,
            'Please enter your name for the reservation.',
        )
    }
    onNameUpdate()

    function onPhoneNumberUpdate() {
        var val = phoneNumber.val().replace(/[^0-9]+/g, '').substr(0, 10)
        if (val.length > 6) {
            val = val.substr(0, 3) + ' ' + val.substr(3, 3) + '-' + val.substr(6)
        } else if (val.length > 3) {
            val = val.substr(0, 3) + ' ' + val.substr(3)
        }
        phoneNumber.val(val)

        setValidState(
            'phoneNumber',
            phoneNumber,
            !val,
            val.length === 10 + 2,
            'Please enter a valid 10 digit phone number.',
        )
    }
    onPhoneNumberUpdate()

    function onCardNumberUpdate() {
        var val = cardNo.val().replace(/[^0-9]+/g, '')
        var updated = ''

        for (var i = 0; i < val.length; i += 4) {
            updated += val.substr(i, 4) + '-'
        }

        val = updated.substr(0, Math.min(16 + 3, updated.length - 1))
        cardNo.val(val)

        setValidState(
            'cardNumber',
            cardNo,
            !val,
            val.length === 16+3,
            'You must input a valid 16 digit credit card number.',
        )
    }
    onCardNumberUpdate()

    function onCVCUpdate() {
        var val = cardCvc.val().replace(/[^0-9]+/g, '').substr(0, 3)
        cardCvc.val(val)
        setValidState(
            'cvc',
            cardCvc,
            !val,
            val.length === 3,
            'You must specify a valid 3 digit CVC number.',
        )
    }
    onCVCUpdate()

    function onCardExpiryUpdate() {
        var val = cardExpiry.val().replace(/[^0-9]+/g, '').substr(0, 4)
        if (val.length >= 3) {
            val = val.substr(0, 2) + ' / ' + val.substr(2)
        }
        cardExpiry.val(val)

        var expiry = new Date()

        if (val.length === 7) {
            var match = val.match(/^([0-9]{2}) \/ ([0-9]{2})$/)
            expiry.setMonth(Number(match[1]) - 1)
            expiry.setYear(Number('20' + match[2]))
        }

        setValidState(
            'expiry',
            cardExpiry,
            !val,
            val.length === 7 && +expiry > Date.now(),
            'You must enter a valid expiry date in the future.',
        )
    }
    onCardExpiryUpdate()

    $('.expert-choices .card').each(function(_, card) {
        var radio = $(card).find('input[type="radio"]')

        $(card).on('click', function(evt) {
            radio.get(0).checked = true
            $('.expert-choices .card.border')
                .removeClass('border border-primary card-border')
            $(card)
                .addClass('border border-primary card-border')
        })
    })

    var days = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat']
    var expertSchedules = {
        mike: ['Tue', 'Wed', 'Thurs'],
        melanie: ['Mon', 'Wed', 'Fri'],
        jeremiah: ['Tue', 'Thurs', 'Fri'],
    }

    dateInput.datepicker({
        dateFormat: 'yy-mm-dd',
        beforeShowDay: function(date) {
            var day = days[date.getDay()]
            var expert = $('[name="expertChoice"]:checked').val()
            var expertDays = expertSchedules[expert]
            var dayIsAllowed = (
                day !== 'Sun' &&
                day !== 'Sat' &&
                expertDays.indexOf(day) > -1
            )

            return [
                dayIsAllowed,
                '',
                dayIsAllowed
                    ? null :
                    'Sorry, your expert is not available on this day.',
            ]
        },
        onSelect: function() {
            setValidState(
                'date',
                null,
                false,
                true,
                null,
            )
        },
    })
    personName.on('input', onNameUpdate)
    phoneNumber.on('input', onPhoneNumberUpdate)
    cardNo.on('input', onCardNumberUpdate)
    cardCvc.on('input', onCVCUpdate)
    cardExpiry.on('input', onCardExpiryUpdate)

    setValidState(
        'date',
        null,
        false,
        dateInput.val(),
        null,
    )
})
