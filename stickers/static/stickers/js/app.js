
sticker = {};

function StickerInit() {

    $(".sticker").draggable({
        handle: ".panel-heading",
        containment: "#page",
        start: function() {
            $(this).addClass('moving');
        },
        stop: function() {
            StickerMove($(this));
            $('audio:first-of-type')[0].play();
            $(this).removeClass('moving');
        }
    });

    jQuery.scrollSpeed(500, 500);
 // jQuery.scrollSpeed(100, 800, 'easeOutCubic');

    if (typeof Storage !== "undefined") {

        if (localStorage.sticker) {

            sticker = JSON.parse(localStorage.sticker);

            $.each(sticker, function(index, value) {

                var el = $('.sticker[data-id='+index+']');

                el.css('top', value.top);
                el.css('left', value.left);
            }); 
        }

    } else alert('Oh... It seems that your browser does not support local storage.\nSticker may not work properly!');

    $('.sticker').animate({'opacity': 1.0})
}

function StickerMove(el) {

    var id   = StickerId(el);
    var left = el.css('left');
    var top  = el.css('top');

    sticker[id] = {left: left, top: top};

    StickerSave();
}

function StickerId(el) {

    return el.attr('data-id');
}

function StickerSave() {

    localStorage.sticker = JSON.stringify(sticker);
}

function StickerReset() {

    localStorage.sticker = '';
    StickerInit();
}