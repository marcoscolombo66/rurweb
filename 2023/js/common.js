$( document ).ready(function() {

  // search-overlay
  $('.btn-search').on('click', function(e){
    e.preventDefault();
    $('.search-overlay').addClass('active');
    $('body').addClass('scroll-disabled');

    setTimeout(function(){
      $('#search-input').focus();
    },300)
  });
  $('.close-search').on('click', function(e){
    e.preventDefault();
    $('.search-overlay').removeClass('active');
    $('body').removeClass('scroll-disabled');
  });

  // nav-overlay
  $('.btn-nav').on('click', function(e){
    e.preventDefault();
    $('.nav-overlay').addClass('active');
    $('body').addClass('scroll-disabled');
  });
  $('.close-nav').on('click', function(e){
    e.preventDefault();
    $('.nav-overlay').removeClass('active');
    $('body').removeClass('scroll-disabled');
  });

  // hero carousel
  var swiper_hero = new Swiper('[data-swiper="hero"]', {
    loop: true,
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    autoplay: {
      delay: 3000,
      disableOnInteraction: true,
    }
  });

  // youtube carousel
  var swiper_yt = new Swiper('[data-swiper="youtube"]', {
    loop: true,
    breakpoints: {
      640: {
        slidesPerView: 2
      }
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    }
  });

  // map list
  var swiper_map = new Swiper('[data-swiper="map"]', {
    direction: 'vertical',
    slidesPerView: 'auto',
    freeMode: true,
    scrollbar: {
      el: '.swiper-scrollbar',
    },
    mousewheel: true,
  });

  // Inicializar Fancybox de manera segura
  if (typeof Fancybox !== 'undefined') {
    Fancybox.bind("[data-fancybox]", {
        // Opciones de Fancybox aquí
    });
  }

  // form-status
  $('form').each(function(){

    var status = $(this).attr('data-status');

    if(status == 'success') {
      Swal.fire({
        title: '¡Gracias por contactarnos!',
        text: 'Te estaremos respondiendo a la brevedad.',
        icon: 'success',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#111111'
      })
    }

    if(status == 'error') {
      Swal.fire({
        title: 'Ocurrió un error',
        text: 'Intentá nuevamente en otro momento. ¡Disculpá las molestias ocasionadas!',
        icon: 'error',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#111111'
      })
    }

    if(status == 'incomplete') {
      Swal.fire({
        title: 'Revisá los datos ingresados',
        text: 'Recordá que todos los campos deben ser llenados para poder enviar el formulario.',
        icon: 'warning',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#111111'
      })
    }

    if(status == 'wrongfile') {
      Swal.fire({
        title: 'Revisá los datos ingresados',
        text: 'El archivo que adjuntaste no cumple con el formato requerido: archivo PDF y máximo 10MB de peso.',
        icon: 'warning',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#111111'
      })
    }

  });

});
