// Local storage variable
sticker = {};

// App class
Sticker = {

    // Ajax requests
    Ajax: {

        login: function(event, form, next) {
            
            event.preventDefault();

            var username  = $(form).children('[name=username]').val();
            var password  = $(form).children('[name=password]').val();

            $.ajax({
                url: django.url_login,
                type: 'POST',
                data: {
                    'username': username,
                    'password': password,
                    'next': next,
                    'csrfmiddlewaretoken': django.csrf_token
                },
                success: function() {

                    location.reload();
                }
            });
        },

        register: function(event, form, next) {
            
            event.preventDefault();

            var email     = $(form).children('[name=email]').val();
            var username  = $(form).children('[name=username]').val();
            var password  = $(form).children('[name=password]').val();

            $.ajax({
                url: django.url_register,
                type: 'POST',
                data: {
                    'email':    email,
                    'username': username,
                    'password': password,
                    'next': next,
                    'csrfmiddlewaretoken': django.csrf_token
                },
                success: function() {

                    $('form.login').children('[name=username]').val(username);
                    $('form.login').children('[name=password]').val(password);
                    $('form.login').submit();
                }
            });
        },

        create: function(event, form) {
            
            event.preventDefault();

            var title       = $(form).children('[name=title]').val();
            var color       = $(form).children('[name=color]').val();
            var description = $(form).children('[name=description]').val();

            $.ajax({
                url: django.url_create,
                type: 'POST',
                dataType: 'JSON',
                data: {
                    'title': title,
                    'color': color,
                    'description': description,
                    'csrfmiddlewaretoken': django.csrf_token
                },
                success: function(result) {

                    Sticker.create(result, title, description, color);
                }
            });
        },

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

    // Functions
    init: function() {

        // Check for stickers
        Sticker.nothing();

        // jQuery draggable init
        Sticker.draggable();

        // jQuery speed scroll init
        jQuery.scrollSpeed(500, 500);

        // If there's any stickers
        if (Sticker.count() > 0) {

            // If local storage is supported
            if (typeof Storage !== "undefined") {

                // If sticker is set in local storage
                if (localStorage.sticker) {

                    sticker = JSON.parse(localStorage.sticker);

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

                    Sticker.position(value);
                });
            }
        }

        // Stickers vissiblity init
        $('.sticker').animate({ 'opacity': 1.0 });
    },

    update: function(el, live) {

        var id = Sticker.id(el);
        var left = $(el).css('left');
        var top = $(el).css('top');

        sticker[id] = {
            left: left, 
            top: top
        };

        Sticker.save();
        Sticker.nothing();
    },

    save: function() {

        delete sticker["0"];

        localStorage.sticker = JSON.stringify(sticker);
    },

    create: function(id, title, description, color) {

        $('.dropdown-create[aria-expanded=true]').dropdown('toggle');

        $('.sticker-empty .title').text(title);
        $('.sticker-empty .description').html(description.replace(/\n/g, "<br>"));
        $('.sticker-empty > div').removeAttr('no-description');
        $('.sticker-empty > div').removeAttr('no-color');
        $('.sticker-empty > div').attr('data-id', id);
        $('.sticker-empty > div').attr('title', 'by You');
        $('.sticker-empty > div').css('left', 100);
        $('.sticker-empty > div').css('top', 0);
        $('.sticker-empty .color').css('background', color);

        if (description.length < 1)
            $('.sticker-empty > div').attr('no-description', ' ');

        if (color.length < 1)
            $('.sticker-empty > div').attr('no-color', ' ');

        var new_el = $('.sticker-empty').clone().prependTo('.sticker-container');
        new_el.removeClass('sticker-empty').children().addClass('sticker');

        $('.sticker-empty > div').attr('data-id', 0);

        Sticker.nothing();
        Sticker.position(new_el.children());
        Sticker.draggable();
    },

    delete: function(el) {

        $(el).parent().fadeOut(1000, function() {
            $(this).remove();
            Sticker.nothing();
        })

        delete sticker[Sticker.id(el)];

        Sticker.save();
    },

    draggable: function() {

        $(".sticker").draggable({
            handle: ".panel-heading",
            containment: ".sticker-container",
            // scrollSensitivity: 100,
            // snap: ".sticker-outer",
            // snapMode: "outer",
            stack: ".sticker",
            start: function() {
                $(this).addClass('moving');
            },
            stop: function(e, ui) {
                $(this).removeClass('moving');

                Sticker.update($(this));

                $('audio:first-of-type')[0].volume = 0.1;
                $('audio:first-of-type')[0].play();
            }
        });
    },

    reset: function() {

        localStorage.removeItem('sticker');
        Sticker.init();
        return false;
    },

    position: function(el) {
        
        $(el).animate(
            {'left': Random(0, $('.page').width()-$(el).width()),
             'top':  Random(85, $(window).height()-$(el).height())
            }, 1000, function() { Sticker.update(el) }
        );
    },

    nothing: function() {
        
        if (Sticker.count() < 1) {

            $('.oh-no-stickers').fadeIn();
            $('.sticker-container').hide();
        
        } else {

            $('.oh-no-stickers').hide();
            $('.sticker-container').fadeIn();
        }
    },

    id: function(el) {

        return $(el).attr('data-id');
    },

    el: function(id) {

        return $('.sticker[data-id='+id+']');
    },

    count: function() {
        
        return $('.sticker-container').children().length;
    },
}

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

            $(this).removeClass("hover");
            break;
        }
        case 'dblclick': {

            Sticker.Ajax.delete(Sticker.id(this));
            break;
        }
    }
});

// Other

function Random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}