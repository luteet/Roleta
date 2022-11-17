
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

function Popup() {
  
  let body = document.querySelector('body'),
      html = document.querySelector('html'),
      duration = 200,
      popupCheck = true,
      popupCheckClose = true;

  const open = function (id) {
    if(popupCheck) {
      popupCheck = false;

      let popup = document.querySelector(id);

      if(popup) {

          body.classList.remove('_popup-active');
          html.style.setProperty('--popup-padding', window.innerWidth - body.offsetWidth + 'px');
          body.classList.add('_popup-active');

          popup.classList.add('_active');

          FX.fadeIn(popup, {
              duration: duration,
              complete: function () {
                popupCheck = true;
              }
          });

      } else {
        return new Error(`Not found "${id}"`)
      }
    }
  }

  const close = function (popupClose) {
    if (popupCheckClose) {
      popupCheckClose = false;

      let popup
      if(typeof popupClose === 'string') {
        popup = document.querySelector(popupClose)
      } else {
        popup = popupClose.closest('.popup');
      }

      FX.fadeOut(popup, {
          duration: duration,
          complete: function () {
              popup.style.display = 'none';

              body.classList.remove('_popup-active');
              html.style.setProperty('--popup-padding', '0px');
              popup.classList.remove('_active');

              popupCheckClose = true;
          }
      });
      
      }
  }

  return {
    
    open: function (id) {
      open(id);
    },

    close: function (popupClose) {
      close(popupClose)
    },

    init: function() {
      let thisTarget
      body.addEventListener('click', function(event) {
  
        thisTarget = event.target;

        let popupOpen = thisTarget.closest('.open-popup');
        if(popupOpen) {
            event.preventDefault();
            open(popupOpen.getAttribute('href'))
        }

        let popupClose = thisTarget.closest('.popup-close');
        if(popupClose) {
            close(popupClose)
        }
  
      });
    },
    
  }
}

const popup = new Popup();

popup.init()

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

      document.querySelectorAll('.header__nav--link._hover').forEach(headerNavLink => {
        headerNavLink.classList.remove('_hover')
      })
    
      document.querySelectorAll('.header__sub--link._active').forEach(headerSubLink => {
        headerSubLink.classList.remove('_active')
      })

      document.querySelectorAll('.header__sub--link._hover').forEach(headerSubLink => {
        headerSubLink.classList.remove('_hover')
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


let resizeCheck = {}, windowSize;

/* function resizeCheckFunc(size, minWidth, maxWidth) {
  if (windowSize <= size && (resizeCheck[String(size)] == true || resizeCheck[String(size)] == undefined) && resizeCheck[String(size)] != false) {
    resizeCheck[String(size)] = false;
    maxWidth(); // < size
  }

  if (windowSize >= size && (resizeCheck[String(size)] == false || resizeCheck[String(size)] == undefined) && resizeCheck[String(size)] != true) {
    resizeCheck[String(size)] = true;
    minWidth(); // > size
  }
} */

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

const mainLinks = document.querySelectorAll('.header__nav--link'),
      subLinks = document.querySelectorAll('.header__sub--link'),
      subBlocks = document.querySelectorAll('.header__sub--block'),
      subPlace = document.querySelectorAll('.header__sub--place'),
      headerNavItems = document.querySelectorAll('.header__nav--item');

mainLinks.forEach(mainLink => {

  mainLink.addEventListener('mouseenter', function (event) {

      if(windowSize >= 992) {
        
        if(!mainLink.classList.contains('_hover')) {

          if(mainLink.classList.contains('_has-sub-menu')) {

            setTimeout(() => {

              removeSubActive()
              if(document.querySelector('.header__nav--link._hover')) {
                document.querySelector('.header__nav--link._hover').classList.remove('_hover')
              }
      
              const headerSubBlock = document.querySelector(mainLink.dataset.href);
              headerSubBlock.classList.add('_active');
              mainLink.classList.add('_hover');

            },0)
          }

        }

      }
      
  })
  
})

subLinks.forEach(subLink => {

  subLink.addEventListener('mouseenter', function (event) {

      if(windowSize >= 992) {
        
        if(!subLink.classList.contains('_hover')) {

          if(subLink.classList.contains('_has-sub-menu')) {

            setTimeout(() => {

              if(document.querySelector('.header__sub--link._hover')) {
                removeSubActive(document.querySelector('.header__sub--link._hover').dataset.href, true)
                document.querySelector('.header__sub--link._hover').classList.remove('_hover')
              }
      
              const headerSubBlock = document.querySelector(subLink.dataset.href);
              headerSubBlock.classList.add('_active');
              subLink.classList.add('_hover');

            },0)
          }

        }

      }
      
  })

})

headerNavItems.forEach(headerNavItem => {
  
  headerNavItem.addEventListener('mouseleave', function (event) {

    if(windowSize >= 992) {
      headerNavItem.querySelectorAll('.header__sub--block').forEach(subBlock => {
        removeSubActive()
      })
    }
    
  })

})

const headerContainer = document.querySelector('.header__container');


function resize() {

  windowSize = window.innerWidth;
  html.style.setProperty('--height-header', header.offsetHeight + 'px');
  html.style.setProperty('--width-scrollbar', windowSize - body.offsetWidth + 'px');
  html.style.setProperty('--height-screen', window.innerHeight + 'px')

  mainLinks.forEach(mainLink => {

    mainLink.parentElement.classList.remove('_reverse')
    
    if((windowSize / 2 - 50) > (getCoords(mainLink.parentElement).left - getCoords(headerContainer).left)) {
      mainLink.parentElement.style.setProperty('--x', getCoords(mainLink.parentElement).left - getCoords(headerContainer).left + 'px');
    } else {
      mainLink.parentElement.classList.add('_reverse');
      mainLink.parentElement.style.setProperty('--x', getCoords(headerContainer).left  + headerContainer.offsetWidth - getCoords(mainLink.parentElement).left - mainLink.parentElement.offsetWidth + 'px');
    }
    
  })

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

        if(!headerNavLink.classList.contains('_active') && !headerNavLink.classList.contains('_hover')) {

          if(headerNavLink.classList.contains('_has-sub-menu')) {
            event.preventDefault();
  
            removeSubActive()
    
            const headerSubBlock = document.querySelector(headerNavLink.dataset.href);
            headerSubBlock.classList.add('_active');
            headerNavLink.classList.add('_active');
          }
  
        }/*  else {
          
          if(headerNavLink.classList.contains('_has-sub-menu')) {
            event.preventDefault();
            removeSubActive()
          }
  
        } */

      }
      
    } else if(!$('.header__sub--block') && windowSize >= 992) {

      removeSubActive()

    }

    let headerNavArrowBtn = $('.header__nav--arrow-btn');
    if(headerNavArrowBtn) {
      event.preventDefault();
      const headerNavLink = headerNavArrowBtn.closest('.header__nav--link')
      if(headerNavLink.classList.contains('_has-sub-menu')) {

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

    let headerSubLink = $('.header__sub--link');
    if (headerSubLink) {

      if(windowSize >= 992) {
        
        if(!headerSubLink.classList.contains('_active') && !headerSubLink.classList.contains('_hover')) {

          if(headerSubLink.classList.contains('_has-sub-menu')) {
            event.preventDefault();

            if(document.querySelector('.header__sub--link._active')) {
              removeSubActive(document.querySelector('.header__sub--link._active').dataset.href, true)
            }
    
            const headerSubBlock = document.querySelector(headerSubLink.dataset.href);
            headerSubBlock.classList.add('_active');
            headerSubLink.classList.add('_active');
          }

        } else {

          /* event.preventDefault();
          if(headerSubLink.classList.contains('_has-sub-menu')) {
            removeSubActive({
              subMenu: headerSubLink.getAttribute('href'),
            });
            headerSubLink.classList.remove('_active');
          } */

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
  
        container.dataset.hideBlocksLength = ((length - 6) > 0) ? length - 6 : 0
  
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

// =-=-=-=-=-=-=-=-=-=-=-=- </slider> -=-=-=-=-=-=-=-=-=-=-=-=

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

const notFound = document.querySelector('.search-main__result--not-found');

let filterData = {
  color: '',
  type: '',
};

function searchFilter(filterData) {

  const items = (document.querySelector('.search-main__result--item._search-filtered')) ? document.querySelectorAll('.search-main__result--item._search-filtered') : document.querySelectorAll('.search-main__result--item');

  function filterCheck(item) {
    let check = false, count = [0,0];
    if(Object.keys(filterData).length > 0) {

      if(filterData['color']) {
        count[0] = count[0]+1;
        if(filterData['color'] == item.dataset.color) {
          count[1] = count[1]+1;
        }
      }

      if(filterData['type']) {
        count[0] = count[0]+1;
        if(filterData['type'] == item.dataset.type) {
          //check = true;
          count[1] = count[1]+1;
        }
      }

      if(count[0] == count[1]) {
        check = true;
      }

    } else {
      check = true;
    }
    
    return check;
  }

  let foundCheck = false;
  
  items.forEach(item => {
    
    if(!filterCheck(item)) {
      item.classList.add('_hidden')
      item.classList.remove('_filtered')
    } else {
      foundCheck = true;
      item.classList.remove('_hidden')
      item.classList.add('_filtered')
    }
  })

  if(!foundCheck && notFound) {
    notFound.classList.remove('_hidden');
  } else {
    notFound.classList.add('_hidden');
  }


}

function search() {
    
  let filter = searchInput.value.toUpperCase(),
      items = (document.querySelector('.search-main__result--item._filtered')) ? document.querySelectorAll('.search-main__result--item._filtered') : document.querySelectorAll('.search-main__result--item'),
      foundCheck = false;
  
  for (let index = 0; index < items.length; index++) {
      let text = items[index].querySelector('.search-main__result--text'),
          count = [0,0];

      if (text.textContent.toUpperCase().indexOf(filter) <= -1) {
        items[index].classList.add('_hidden');
        if(filter) {
          items[index].classList.remove('_search-filtered')
        }
      } else {

        if(filterData['color']) {
          count[0] = count[0]+1;
          if(filterData['color'] == items[index].dataset.color) {
            count[1] = count[1]+1;
          }
        }
  
        if(filterData['type']) {
          count[0] = count[0]+1;
          if(filterData['type'] == items[index].dataset.type) {
            count[1] = count[1]+1;
          }
        }

        if(count[0] == count[1]) {
          items[index].classList.remove('_hidden');

          if(filter) {
            items[index].classList.add('_search-filtered')
          }
          
          if(!foundCheck) foundCheck = true;
        }
        
      }
  }

  if(!foundCheck && notFound) {
    notFound.classList.remove('_hidden')
  } else if(foundCheck && notFound) {
    notFound.classList.add('_hidden')
  }
  
}

const searchInput = document.querySelector('#search-input');

if(searchInput) {
  searchInput.addEventListener('input', function() {
    search()
  })
  search()
}


if(document.querySelector('.custom-select')) {

  var filterSelectOptions = [];

  document.querySelectorAll('.custom-select').forEach(customSelect => {
    const options = customSelect.querySelectorAll('option');

    options.forEach(option => {
      filterSelectOptions.push(option);
    })

  });

  function setFilterData() {
    filterData = {
      color: '',
      type: '',
    };

    for(let index = 0; index < filterSelectOptions.length; index++) {
      
      if(filterSelectOptions[index].selected && !filterSelectOptions[index].disabled) {

        if(filterSelectOptions[index].dataset.filterColor) filterData['color'] = filterSelectOptions[index].dataset.filterColor;
        if(filterSelectOptions[index].dataset.filterType) filterData['type'] = filterSelectOptions[index].dataset.filterType;

      }
    }
  }

  setTimeout(() => {
    setFilterData()
  },0)

  document.querySelectorAll('.custom-select').forEach(customSelect => {

    new SlimSelect({
      select: customSelect,
      showSearch: false,
      onChange: function () {

        setFilterData();
        searchFilter(filterData)
        search();

      }
    })

  })

  searchFilter(filterData)

}

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
