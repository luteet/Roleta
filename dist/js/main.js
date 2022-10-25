
let slideCheck = true;
let slideUp = (target, duration=500) => {
  slideCheck = false
  target.style.transitionProperty = 'height, margin, padding';
  target.style.transitionDuration = duration + 'ms';
  target.style.boxSizing = 'border-box';
  target.style.height = target.offsetHeight + 'px';
  target.offsetHeight;
  target.style.overflow = 'hidden';
  target.style.height = 0;
  target.style.paddingTop = 0;
  target.style.paddingBottom = 0;
  target.style.marginTop = 0;
  target.style.marginBottom = 0;
  window.setTimeout( () => {
    target.style.display = 'none';
    target.style.removeProperty('height');
    target.style.removeProperty('padding-top');
    target.style.removeProperty('padding-bottom');
    target.style.removeProperty('margin-top');
    target.style.removeProperty('margin-bottom');
    target.style.removeProperty('overflow');
    target.style.removeProperty('transition-duration');
    target.style.removeProperty('transition-property');
    slideCheck = true;
  }, duration);
}

let slideDown = (target, duration=500) => {
  slideCheck = false;
  target.style.removeProperty('display');
  let display = window.getComputedStyle(target).display;

  if (display === 'none')
    display = 'block';

  target.style.display = display;
  let height = target.offsetHeight;
  target.style.overflow = 'hidden';
  target.style.height = 0;
  target.style.paddingTop = 0;
  target.style.paddingBottom = 0;
  target.style.marginTop = 0;
  target.style.marginBottom = 0;
  target.offsetHeight;
  target.style.boxSizing = 'border-box';
  target.style.transitionProperty = "height, margin, padding";
  target.style.transitionDuration = duration + 'ms';
  target.style.height = height + 'px';
  target.style.removeProperty('padding-top');
  target.style.removeProperty('padding-bottom');
  target.style.removeProperty('margin-top');
  target.style.removeProperty('margin-bottom');
  window.setTimeout( () => {
    target.style.removeProperty('height');
    target.style.removeProperty('overflow');
    target.style.removeProperty('transition-duration');
    target.style.removeProperty('transition-property');
    slideCheck = true;
  }, duration);
}



(function () {
  var FX = {
      easing: {
          linear: function (progress) {
              return progress;
          },
          quadratic: function (progress) {
              return Math.pow(progress, 2);
          },
          swing: function (progress) {
              return 0.5 - Math.cos(progress * Math.PI) / 2;
          },
          circ: function (progress) {
              return 1 - Math.sin(Math.acos(progress));
          },
          back: function (progress, x) {
              return Math.pow(progress, 2) * ((x + 1) * progress - x);
          },
          bounce: function (progress) {
              for (var a = 0, b = 1, result; 1; a += b, b /= 2) {
                  if (progress >= (7 - 4 * a) / 11) {
                      return -Math.pow((11 - 6 * a - 11 * progress) / 4, 2) + Math.pow(b, 2);
                  }
              }
          },
          elastic: function (progress, x) {
              return Math.pow(2, 10 * (progress - 1)) * Math.cos(20 * Math.PI * x / 3 * progress);
          }
      },
      animate: function (options) {
          var start = new Date;
          var id = setInterval(function () {
              var timePassed = new Date - start;
              var progress = timePassed / options.duration;
              if (progress > 1) {
                  progress = 1;
              }
              options.progress = progress;
              var delta = options.delta(progress);
              options.step(delta);
              if (progress == 1) {
                  clearInterval(id);
  
                  options.complete();
              }
          }, options.delay || 10);
      },
      fadeOut: function (element, options) {
          var to = 1;
          this.animate({
              duration: options.duration,
              delta: function (progress) {
                  progress = this.progress;
                  return FX.easing.swing(progress);
              },
              complete: options.complete,
              step: function (delta) {
                  element.style.opacity = to - delta;
              }
          });
      },
      fadeIn: function (element, options) {
          var to = 0;
          element.style.display = 'block';
          this.animate({
              duration: options.duration,
              delta: function (progress) {
                  progress = this.progress;
                  return FX.easing.swing(progress);
              },
              complete: options.complete,
              step: function (delta) {
                  element.style.opacity = to + delta;
              }
          });
      }
  };
  window.FX = FX;
})()

class Popup {

  static body = document.querySelector('body');
  static html = document.querySelector('html');
  static idOnUrl = false;
  static duration = 200;

  static popupCheck = true;
  static popupCheckClose = true;

  static remHash() {
    let uri = window.location.toString();
    if (uri.indexOf("#") > 0) {
        let clean_uri = uri.substring(0, uri.indexOf("#"));
        window.history.replaceState({}, document.title, clean_uri);
    }
  }

  static open(id) {
    
    if(Popup.popupCheck) {
      Popup.popupCheck = false;

      let popup = document.querySelector(id);

      if(popup) {

          Popup.body.classList.remove('_popup-active');
          Popup.html.style.setProperty('--popup-padding', window.innerWidth - Popup.body.offsetWidth + 'px');
          Popup.body.classList.add('_popup-active');

          popup.classList.add('_active');
          
          if(Popup.idOnURL) history.pushState('', "", id);

          FX.fadeIn(popup, {
              duration: Popup.duration,
              complete: function () {
                Popup.popupCheck = true;
                Popup.body.classList.add('_blur-all');
              }
          });

      } else {
        return new Error(`Not found "${id}"`)
      }
    }
  }

  static close(popupClose) {
    
    if (Popup.popupCheckClose) {
      Popup.popupCheckClose = false;

      let popup
      if(typeof popupClose === 'string') {
        popup = document.querySelector(popupClose)
      } else {
        popup = popupClose.closest('.popup');
      }

      FX.fadeOut(popup, {
          duration: Popup.duration,
          complete: function () {
              popup.style.display = 'none';

              if(Popup.idOnURL) Popup.remHash();

              Popup.body.classList.remove('_popup-active');
              Popup.html.style.setProperty('--popup-padding', '0px');
              popup.classList.remove('_active');

              Popup.popupCheckClose = true;

              Popup.body.classList.remove('_blur-all');
          }
      });
      
  }
  }

  static start() {
    let thisTarget
    Popup.body.addEventListener('click', function(event) {

        thisTarget = event.target;

        let popupOpen = thisTarget.closest('.open-popup');
        if(popupOpen) {
            event.preventDefault();

            Popup.open(popupOpen.getAttribute('href'))
        }

        let popupClose = thisTarget.closest('.popup-close');
        if(popupClose) {

            Popup.close(popupClose)
            
        }

    });

    if(Popup.idOnURL) {
      let url = new URL(window.location);
      if(url.hash) {
        let timeoutDuration = Popup.duration;
        Popup.duration = 0;
        Popup.open(url.hash);
        setTimeout(() => {
          Popup.duration = timeoutDuration;
        }, timeoutDuration)
      }
    }
  };

  constructor () {
    Popup.start()
  }
}

new Popup

const body = document.querySelector('body'),
    html = document.querySelector('html'),
    menu = document.querySelectorAll('.header__burger, .header__nav, body'),
    burger = document.querySelector('.header__burger'),
    header = document.querySelector('.header');


function removeSubActive(subMenu, alt) {
  
  if(!subMenu) {

    if(!alt) {

      document.querySelectorAll('.header__sub--block._active').forEach(headerSubBlock => {
        headerSubBlock.classList.remove('_active')
      })
    
      document.querySelectorAll('.header__nav--link._active').forEach(headerNavLink => {
        headerNavLink.classList.remove('_active')
      })
    
      document.querySelectorAll('.header__sub--link._active').forEach(headerSubLink => {
        headerSubLink.classList.remove('_active')
      })

    } else {

      /* document.querySelectorAll('.header__sub--block._active').forEach(headerSubBlock => {
        headerSubBlock.classList.remove('_active')
      }) */

      document.querySelectorAll('.header__sub--link._active').forEach(headerSubLink => {
        headerSubLink.classList.remove('_active')
      })

    }
    
  } else {
    document.querySelector(subMenu).classList.remove('_active');

    if(alt) {
      document.querySelectorAll('.header__sub--link._active').forEach(headerSubLink => {
        headerSubLink.classList.remove('_active')
      })
    }
  }
}

/* let magicGrid = new MagicGrid({
  container: ".reviews__list",
  static: true,
  animate: true,
  gutter: 30,
}); */



let resizeCheck = {}, windowSize;

function resizeCheckFunc(size, minWidth, maxWidth) {
  if (windowSize <= size && (resizeCheck[String(size)] == true || resizeCheck[String(size)] == undefined) && resizeCheck[String(size)] != false) {
    resizeCheck[String(size)] = false;
    maxWidth(); // < size
  }

  if (windowSize >= size && (resizeCheck[String(size)] == false || resizeCheck[String(size)] == undefined) && resizeCheck[String(size)] != true) {
    resizeCheck[String(size)] = true;
    minWidth(); // > size
  }
}

const hideBlocksWrapper = document.querySelectorAll('.hide-blocks');

function hideBlocks() {
  
  hideBlocksWrapper.forEach(hideBlocksWrapper => {
    const length = Number(hideBlocksWrapper.dataset.hideBlocksLength),
          blocks = hideBlocksWrapper.children;

    for(let index = blocks.length-1, count = 0; index >= 0; index--, count++) {
      if(count < length) {
        blocks[index].classList.add('_hidden');
      } else {
        blocks[index].classList.remove('_hidden');
      }
    }

    masonry({
      column: 4,
      responsive: [{
        breakpoint: 992, 
        column: 3
      }, {
        breakpoint: 768,
        column: 2
      }]
    });
    
  })

}

function resize() {

  windowSize = window.innerWidth;
  html.style.setProperty('--height-header', header.offsetHeight + 'px');
  html.style.setProperty('--width-scrollbar', windowSize - body.offsetWidth + 'px');
  html.style.setProperty('--height-screen', window.innerHeight + 'px')

  /* resizeCheckFunc(992,
  function () {  // screen > 

    

  },
  function () {  // screen < 

    

  }); */

}

resize();

window.onresize = resize;

hideBlocks()



let thisTarget;
body.addEventListener('click', function (event) {

    thisTarget = event.target;
    function $(arg) {
      return thisTarget.closest(arg);
    }

    // =-=-=-=-=-=-=-=-=-=- <toggle header menu> -=-=-=-=-=-=-=-=-=-=-
    
    if (thisTarget.closest('.header__burger')) {
        menu.forEach(element => {
            element.classList.toggle('_active')
        })
        setTimeout(() => {
          body.classList.toggle('_blur');
        },200)
    } else if($('.header__nav--bg')) {
      menu.forEach(element => {
        element.classList.remove('_active')
      })
      setTimeout(() => {
        body.classList.remove('_blur');
      },200)
    }
    
    // =-=-=-=-=-=-=-=-=-=- </toggle header menu> -=-=-=-=-=-=-=-=-=-=-



    // =-=-=-=-=-=-=-=-=-=- <Toggle sub menu in header> -=-=-=-=-=-=-=-=-=-=-

    let headerNavLink = $('.header__nav--link');
    if (headerNavLink) {

      if(windowSize >= 992) {

        if(!headerNavLink.classList.contains('_active')) {

          if(headerNavLink.classList.contains('_has-sub-menu')) {
            event.preventDefault();
  
            removeSubActive()
    
            const headerSubBlock = document.querySelector(headerNavLink.getAttribute('href'));
            headerSubBlock.classList.add('_active');
            headerNavLink.classList.add('_active');
          }
  
        } else {
  
          event.preventDefault();
          removeSubActive()
  
        }

      } else {

        if(headerNavLink.classList.contains('_has-sub-menu')) {

            event.preventDefault();

            if(slideCheck) {

              if(headerNavLink.classList.contains('_active')) {

                headerNavLink.classList.remove('_active')
    
                const headerSubBlock = headerNavLink.parentElement.querySelector('.header__nav--sub');
                slideUp(headerSubBlock);
                headerNavLink.parentElement.classList.remove('_active');
    
              } else {
    
                document.querySelectorAll('.header__nav--link._active').forEach(headerNavLinkActive => {
                  headerNavLinkActive.classList.remove('_active')
        
                  const headerSubBlock = headerNavLinkActive.parentElement.querySelector('.header__nav--sub');
                  slideUp(headerSubBlock);
                  headerNavLinkActive.parentElement.classList.remove('_active');
    
                })
    
                headerNavLink.classList.add('_active')
        
                const headerSubBlock = headerNavLink.parentElement.querySelector('.header__nav--sub');
                slideDown(headerSubBlock);
                headerNavLink.parentElement.classList.add('_active');
    
              }

            }

          

        }
        
      }
      
    } else if(!$('.header__sub--block') && windowSize >= 992) {

      removeSubActive()

    }

    let headerSubLink = $('.header__sub--link');
    if (headerSubLink) {

      if(windowSize >= 992) {
        
        if(!headerSubLink.classList.contains('_active')) {

          if(headerSubLink.classList.contains('_has-sub-menu')) {
            event.preventDefault();

            if(document.querySelector('.header__sub--link._active')) {
              removeSubActive(document.querySelector('.header__sub--link._active').getAttribute('href'), true)
            }
    
            const headerSubBlock = document.querySelector(headerSubLink.getAttribute('href'));
            headerSubBlock.classList.add('_active');
            headerSubLink.classList.add('_active');
          }

        } else {

          event.preventDefault();
          if(headerSubLink.classList.contains('_has-sub-menu')) {
            removeSubActive({
              subMenu: headerSubLink.getAttribute('href'),
            });
            headerSubLink.classList.remove('_active');
          }

        }

      }
      
    } else if(!$('.header__sub--block') && !document.querySelector('.header__nav--link._active') && windowSize >= 992) {
      
      removeSubActive()

    }

    // =-=-=-=-=-=-=-=-=-=- </Toggle sub menu in header> -=-=-=-=-=-=-=-=-=-=-



    // =-=-=-=-=-=-=-=-=-=- <Scroll to block> -=-=-=-=-=-=-=-=-=-=-

    let btnToScroll = $('.btn-to-scroll');
    if(btnToScroll) {
      event.preventDefault();
      let section;
    
      try {
        section = document.querySelector(btnToScroll.getAttribute('href'))
      } catch {
        section = 0
      }
      
    
      menu.forEach(elem => {
        elem.classList.remove('_active')
      })
    
      window.scroll({
        left: 0,
        top: (section) ? (window.innerWidth <= 992) ? section.offsetTop - header.offsetHeight : section.offsetTop : 0,
        behavior: 'smooth'
      })
    
    }

    // =-=-=-=-=-=-=-=-=-=- <Scroll to block> -=-=-=-=-=-=-=-=-=-=-



    // =-=-=-=-=-=-=-=-=-=- <FAQ> -=-=-=-=-=-=-=-=-=-=-

    let faqItemQuestion = $('.faq__item--question');
    if(faqItemQuestion) {

      const item = faqItemQuestion.closest('.faq__item'),
            answear = item.querySelector('.faq__item--answear');

      
      if(!item.classList.contains('_sliding')) {
        item.classList.toggle('_active');
      }

      if(item.classList.contains('_active') && !item.classList.contains('_sliding')) {

        item.classList.add('_sliding')
        slideDown(answear);
        setTimeout(() => {
          item.classList.remove('_sliding')
        },500)

      } else if(!item.classList.contains('_active') && !item.classList.contains('_sliding')) {

        item.classList.add('_sliding')
        slideUp(answear);
        setTimeout(() => {
          item.classList.remove('_sliding')
        },500)

      }

    }

    // =-=-=-=-=-=-=-=-=-=- <FAQ> -=-=-=-=-=-=-=-=-=-=-



    // =-=-=-=-=-=-=-=-=-=- <Hide blocks> -=-=-=-=-=-=-=-=-=-=-

    let hideBlocksLoad = $('.hide-blocks-load');
    if(hideBlocksLoad) {
      event.preventDefault();

      if(!hideBlocksLoad.classList.contains('_loading')) {
        hideBlocksLoad.classList.add('_loading');

        const id = hideBlocksLoad.dataset.hideBlocksId,
              container = document.querySelector(id),
              length = Number(container.dataset.hideBlocksLength);
  
        container.dataset.hideBlocksLength = ((length - 6) > 0) ? length - 6 : 0;

        //console.log((length - 6))
  
        setTimeout(() => {
          hideBlocks()
          hideBlocksLoad.classList.remove('_loading');

          if(container.dataset.hideBlocksLength == 0) {
            hideBlocksLoad.style.display = 'none';
          }
        },200)
      }
      
    }

    // =-=-=-=-=-=-=-=-=-=- </Hide blocks> -=-=-=-=-=-=-=-=-=-=-

})


// =-=-=-=-=-=-=-=-=-=-=-=- <slider> -=-=-=-=-=-=-=-=-=-=-=-=


let getIdeaGalleryslider = new Swiper('.get-idea__gallery-slider', {
  
  spaceBetween: 6,
  slidesPerView: 6,

  direction: "vertical",
  
  watchSlidesProgress: true,
  
  breakpoints: {
    992: {
      slidesPerView: 5,
      spaceBetween: 30,
    },
  }
}); 

let getIdeaInfoslider = new Swiper('.get-idea__info-slider', {
  
  spaceBetween: 30,
  slidesPerView: 1,

  navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
  },

  
 /*  thumbs: {
    swiper: getIdeaImageslider
  } */
 
});

let getIdeaImageslider = new Swiper('.get-idea__image-slider', {
  
  spaceBetween: 0,
  slidesPerView: 1,

  effect: 'fade',
  fadeEffect: {
    crossFade: true
  },

  thumbs: {
    swiper: getIdeaGalleryslider
  }

  /* thumbs: {
    swiper: getIdeaInfoslider
  } */

}); 



const getIdeaInfoSliderLength = document.querySelector('.get-idea__info-slider--length');

getIdeaInfoslider.on("slideChangeTransitionEnd", function() {

let currentNumber;
for(let index = 0; index < getIdeaInfoslider.slides.length; index++) {
  if(getIdeaInfoslider.slides[index].classList.contains('swiper-slide-active')) {
    currentNumber = (index+1 <= 9) ? '0' + (index + 1) : index + 1;
  }
}

getIdeaInfoSliderLength.dataset.currentSlide = currentNumber;
})

let productMainGallerySlider = new Swiper('.product-main__gallery-slider', {
  
  spaceBetween: 6,
  slidesPerView: 7,
  
  watchSlidesProgress: true,
  
  breakpoints: {
    992: {
      slidesPerView: 5,
      spaceBetween: 35,
    },
  }
}); 

let productMainSlider = new Swiper('.product-main__slider', {
  
  spaceBetween: 0,
  slidesPerView: 1,

  effect: 'fade',
  fadeEffect: {
    crossFade: true
  },

  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },

  thumbs: {
    swiper: productMainGallerySlider
  }

});

//product-main__gallery-slider

// =-=-=-=-=-=-=-=-=-=-=-=- </slider> -=-=-=-=-=-=-=-=-=-=-=-=

document.querySelectorAll('.get-idea__gallery-slider--image').forEach(element => {
  element.addEventListener('click', function (event) {
    //console.log(event/* .target.closest('.get-idea__gallery-slider--image').parentElement */);

  })
  
})

/* 
// =-=-=-=-=-=-=-=-=-=-=-=- <Анимации> -=-=-=-=-=-=-=-=-=-=-=-=

wow = new WOW({
mobile:       false,
})
wow.init();

// =-=-=-=-=-=-=-=-=-=-=-=- </Анимации> -=-=-=-=-=-=-=-=-=-=-=-=

*/


function getCoords(elem) {
  var box = elem.getBoundingClientRect();

  return {
  top: box.top + pageYOffset,
  left: box.left + pageXOffset
  };

}

body.insertAdjacentHTML('beforeend', `<div class="check-top-js"></div>`);
const checkTopJs = document.querySelector('.check-top-js');

let coordsTop = getCoords(checkTopJs).top;

function scrollPage() {

  html.style.setProperty('--height-screen', window.innerHeight + 'px')

  coordsTop = getCoords(checkTopJs).top;

  if(coordsTop <= 0 && !header.classList.contains('_on-top')) {
    header.classList.add('_on-top');
  } else if(coordsTop > 0 && header.classList.contains('_on-top')) {
    header.classList.remove('_on-top');
  }
  
}

scrollPage();

window.addEventListener('scroll', function() {
  scrollPage();
})

if(fsLightboxInstances['gallery']) {
  fsLightboxInstances['gallery'].props.onOpen = function() {
    const galleryItems = document.querySelectorAll('[data-fslightbox="gallery"]');
  
    for(let index = 0; index < fsLightboxInstances['gallery'].elements.sourceMainWrappers.length; index++) {
      const item = fsLightboxInstances['gallery'].elements.sourceMainWrappers[index];
  
      item.insertAdjacentHTML("beforeend", `<div class="fslightbox-caption">${galleryItems[index].dataset.alt}</div>`)
  
    }
  
  };
}


document.querySelectorAll('.custom-select').forEach(customSelect => {
  new SlimSelect({
    select: customSelect,
    showSearch: false
  })
})

const cardLabels = document.querySelectorAll('.category-main__card--label');

cardLabels.forEach(cardLabel => {

  const text = cardLabel.querySelector('strong');
  
  function getWidth() {
    text.style.removeProperty('transition');
    text.style.width = 'auto';
    cardLabel.style.setProperty('--width', text.offsetWidth + 'px');
    text.style.removeProperty('width');
    text.style.transition = 'all .2s ease';
  }

  getWidth();

  window.addEventListener('resize', function() {
    getWidth();
  })

})
