// Variables

sticker = {};

// Functions

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
