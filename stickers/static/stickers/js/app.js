// Variables

sticker = {};

// Sticky Functions

function StickerInit() {

    // Check for stickers
    StickerNothing();

    // jQuery draggable init
    StickerDraggable();

    // jQuery speed scroll init
    jQuery.scrollSpeed(500, 500);

    // If there's any stickers
    if (StickerCount() > 0) {

        // If local storage is supported
        if (typeof Storage !== "undefined") {

            // If sticker is set in local storage
            if (localStorage.sticker) {

        delete: function(id) {
            
            if (!confirm('Delete sticker?'))
                return false;

            $.ajax({
                url: django.url_delete.replace('0', id),
                type: 'POST',
                data: {
                    'csrfmiddlewaretoken': django.csrf_token
                },
                success: function(result) {

                    Sticker.delete(Sticker.el(id));
                }
            });
        },
    },

                $.each(sticker, function(index, value) {

                    if (parseInt(index) > 0) {

                        var el = $('.sticker[data-id=' + index + ']');

                        $(el).css('top',  value.top);
                        $(el).css('left', value.left);
                    }
                });
            }

        // If not supported
        } else alert('Oh... It seems that your browser does not support local storage.\nSticker may not work properly!');

        // If there's not sticker saved in local storage
        if (!localStorage.sticker) {

            $('.sticker').each(function(index, value) {

                StickerPosition(value);
            });
        }
    }

    // Stickers vissiblity init
    $('.sticker').animate({ 'opacity': 1.0 });
}

function StickerCount() {
    
    return $('.sticker-container').children().length;
}

function StickerNothing() {
    
    if (StickerCount() < 1) {

        $('.oh-no-stickers').fadeIn();
        $('.sticker-container').hide();
    
    } else {

        $('.sticker-container').fadeIn();
        $('.oh-no-stickers').hide();
    }
}

function StickerDraggable() {

    $(".sticker").draggable({
        handle: ".panel-heading",
        containment: ".sticker-container",
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
}

function StickerUpdate(el, live) {

    var id = StickerId(el);
    var left = $(el).css('left');
    var top = $(el).css('top');

    sticker[id] = { left: left, top: top };

    StickerSave();
}

function StickerId(el) {

    return $(el).attr('data-id');
}

function StickerEl(id) {

    return $('.sticker[data-id='+id+']');
}

function StickerSave() {

    localStorage.sticker = JSON.stringify(sticker);
}

function StickerReset() {

    localStorage.removeItem('sticker');
    StickerInit();
    return false;
}

function StickerCreate(id, title, description, color) {

    $('.dropdown-create[aria-expanded=true]').dropdown('toggle');

    $('.sticker-empty > div > .title').text(title);
    $('.sticker-empty > div > .description').html(description.replace(/\n/g, "<br>"));
    $('.sticker-empty > div').removeAttr('no-description');
    $('.sticker-empty > div').attr('data-id', id);
    $('.sticker-empty > div').css('left', 100);
    $('.sticker-empty > div').css('top', 0);

    if (description.length < 1)
        $('.sticker-empty > div').attr('no-description', ' ');
    delete: function(el) {

    var new_el = $('.sticker-empty').clone().prependTo('.sticker-container');
    new_el.removeClass('sticker-empty').children().addClass('sticker');

    $('.sticker-empty > div').attr('data-id', 0);

    StickerNothing();
    StickerPosition(new_el.children());
    StickerDraggable();
}

function StickerPosition(el) {
    
    $(el).animate(
        {'left': Random(0, $('.page').width()-$(el).width()),
         'top':  Random(85, $(window).height()-$(el).height())
        }, 1000, function() { StickerUpdate(el) }
    );
}

// Base Ajax Functions

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
// Init

$(document).ready(Sticker.init());

// Events

$(".sticker-container").on("mouseenter mouseleave dblclick", ".sticker", function(e) {

    switch (e.type)
    {
        case 'mouseenter': {

            $(this).addClass("hover");
            break;
        }
        case 'mouseleave': {

function Create(event, form, token, url) {
    
    event.preventDefault();

    var title       = $(form).children('[name=title]').val();
    var color       = $(form).children('[name=color]').val();
    var description = $(form).children('[name=description]').val();

    $.ajax({
        url: url,
        type: 'POST',
        dataType: 'JSON',
        data: {
            'title': title,
            'color': color,
            'description': description,
            'csrfmiddlewaretoken': token
        },
        success: function(result) {
            $(this).removeClass("hover");
            break;
        }
        case 'dblclick': {

            StickerCreate(result, title, description, color);
            Sticker.Ajax.delete(Sticker.id(this));
            break;
        }
    });
}

// Other

function Random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}