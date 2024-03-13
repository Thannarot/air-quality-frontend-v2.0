$(function(){
    $('.form-dropdown').select2();

    $('.box__language .btn-toggle').on('click', function(){
        $(this).toggleClass('active');
        $('.box__language .info').toggle();
    });

    $(window).on('click', function() {
        $('.box__language .btn-toggle').removeClass('active');
        $('.box__language .info').hide();
    });

    $('.box__language .btn-toggle, .box__language .info').on('click', function(event){
        event.stopPropagation();
    });

    $('.box__info-analysis .btn-analysis').on('click', function(event){
        $(this).toggleClass('active');
        $('.box__info-analysis .info').toggle();
    });

    $('.box__info-analysis .btn-close').on('click', function(event){
        $('.box__info-analysis .btn-analysis').removeClass('active');
        $('.box__info-analysis .info').hide();
    });

    $('.box__info-ugm .head .icon').on('click', function(event){
        $('.popup__ugm').show();
    });

    $('.box__tool .btn-tool').on('click', function(event){
        $('.box__tool .btn-tool').removeClass('active');
        $('.box__tool [class^="box__info-"]').hide();
    });

    $('.box__tool .air-quality .btn-tool').on('click', function(event){
        $(this).addClass('active');
        $('.box__tool .box__info-air-quality').show();
    });

    $('.box__tool .ground-station .btn-tool').on('click', function(event){
        $(this).addClass('active');
        $('.box__tool .box__info-ground-station').show();
    });

    $('.box__tool .fire-product .btn-tool').on('click', function(event){
        $(this).addClass('active');
        $('.box__tool .box__info-fire-product').show();
    });

    $('.box__tool .statistics-map .btn-tool').on('click', function(event){
        $(this).addClass('active');
        $('.box__tool .box__info-statistics-map').show();
    });

    $('.box__tool .base-map .btn-tool').on('click', function(event){
        $(this).addClass('active');
        $('.box__tool .box__info-base-map').show();
    });

    $('.box__tool .btn-close').on('click', function(event){
        $(this).parent().hide();
        $('.box__tool .btn-tool').removeClass('active');
    });
});