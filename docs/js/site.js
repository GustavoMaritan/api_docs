$('.top-menu>.icon,.conteudo>.menu-aguarde').click(() => {
    !$('.conteudo>.menu').hasClass('open')
        ? $('.conteudo>.menu,.conteudo>.menu-aguarde').addClass('open')
        : $('.conteudo>.menu,.conteudo>.menu-aguarde').removeClass('open');
});

$(window).resize((x, y) => {
    if (window.innerWidth > 900)
        $('.conteudo>.menu,.conteudo>.menu-aguarde').removeClass('open');
});

$('.collapsible>li>.collapsible-header').click(function () {
    let elem = $(this).closest('.collapsible>li').find('.collapsible-body');
    $('.collapsible-body').each(function () {
        if (this != elem[0]) {
            $(this).css({ display: 'none' })
            $(this).closest('li').removeClass('open')
        }
    })
    let isBlock = elem.css('display') == 'block';

    elem.closest('li')[isBlock ? 'removeClass' : 'addClass']('open');
    elem.css({ display: isBlock ? 'none' : 'block' })
});

$('.collection>.collection-item>.title').click(function () {
    let elem = $(this).closest('.collection-item').find('.json');
    !$(elem).hasClass('open')
        ? $(elem).addClass('open')
        : $(elem).removeClass('open');
});