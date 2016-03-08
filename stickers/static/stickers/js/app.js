// Variables

sticker = {};

// Sticky Functions

function StickerInit() {

    // jQuery draggable init
    $(".sticker").draggable({
        handle: ".panel-heading",
        containment: "section.page",
        scrollSensitivity: 100,
        // snap: ".sticker-outer",
        // snapMode: "outer",
        stack: ".sticker",
        start: function() {
            $(this).addClass('moving');
        },
        stop: function(e, ui) {
            $(this).removeClass('moving');

            StickerUpdate($(this));

            $('audio:first-of-type')[0].volume = 0.1;
            $('audio:first-of-type')[0].play();
        }
    });

    // jQuery speed scroll init
    jQuery.scrollSpeed(500, 500);

    // If local storage is supported
    if (typeof Storage !== "undefined") {

        // If sticker is set in local storage
        if (localStorage.sticker) {

            sticker = JSON.parse(localStorage.sticker);

            $.each(sticker, function(index, value) {

                var el = $('.sticker[data-id=' + index + ']');

                $(el).css('top',  value.top );
                $(el).css('left', value.left);
            });
        }

    // If not supported
    } else alert('Oh... It seems that your browser does not support local storage.\nSticker may not work properly!');

    // If there's not sticker saved in local storage
    if (!localStorage.sticker) {

        $('.sticker').each(function(index, value) {

            $(value).animate(
                {'left': Random(0, $('.page').width()-$(value).width()),
                 'top':  Random(85, $(window).height()-$(value).height())
                }, 1000, function() { StickerUpdate(value) }
            );
        });
    }

    // Stickers vissiblity init
    $('.sticker').animate({ 'opacity': 1.0 });
}

function StickerUpdate(el) {

    var id = StickerId(el);
    var left = $(el).css('left');
    var top = $(el).css('top');

    sticker[id] = { left: left, top: top };

    StickerSave();
}

function StickerId(el) {

    return $(el).attr('data-id');
}

function StickerSave() {

    localStorage.sticker = JSON.stringify(sticker);
}

function StickerReset() {

    localStorage.removeItem('sticker');
    StickerInit();
    return false;
}

// Ajax Functions

function Login(event, form, token, url, next) {
    
    event.preventDefault();

    var username  = $(form).children('[name=username]').val();
    var password  = $(form).children('[name=password]').val();

    $.ajax({
        url: url,
        type: 'POST',
        data: {
            'username': username,
            'password': password,
            'next': next,
            'csrfmiddlewaretoken': token
        },
        success: function() {

            location.reload();
        }
    });
}

function Register(event, form, token, url, next) {
    
    event.preventDefault();

    var email     = $(form).children('[name=email]').val();
    var username  = $(form).children('[name=username]').val();
    var password  = $(form).children('[name=password]').val();

    $.ajax({
        url: url,
        type: 'POST',
        data: {
            'email':    email,
            'username': username,
            'password': password,
            'next': next,
            'csrfmiddlewaretoken': token
        },
        success: function() {

            $('form.login').children('[name=username]').val(username);
            $('form.login').children('[name=password]').val(password);
            $('form.login').submit();
        }
    });
}

// Other Functions

function Random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Events

$(".sticker")
    .mouseenter(function() {
        $(this).addClass("hover");
    })
    .mouseleave(function() {
        $(this).removeClass("hover");
    })