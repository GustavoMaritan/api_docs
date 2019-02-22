$(document).on('click', '.menu [data-item]', function () {
    let elem = $('.corpo [data-opcao="' + $(this).attr('data-item') + '"]');
    elem.find('.collapsible-header').trigger('click');

    $('.corpo').animate({
        scrollTop: elem.position().top
    }, 1000);
});