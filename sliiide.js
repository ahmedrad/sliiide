(function ($) {

  //get IE version if browser is IE
  var ie = (function detectIE() {
    var ua = window.navigator.userAgent;

    var msie = ua.indexOf('MSIE ');
    if (msie > 0) {
      return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
    }

    var trident = ua.indexOf('Trident/');
    if (trident > 0) {
      var rv = ua.indexOf('rv:');
      return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
    }

    var edge = ua.indexOf('Edge/');
    if (edge > 0) {
      return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
    }
    return false;
  })();

  $.fn.sliiide = function(options) {

    var settings = $.extend({
      toggle: "#sliiider-toggle",
      exit_selector: ".slider-exit",
      animation_duration: "0.5s",
      place: "right",
      animation_curve: "ease",//cubic-bezier(0.54, 0.01, 0.57, 1.03)",
      body_slide: true,
      no_scroll: false,
      shadow: false,
      shadow_settings: {'background-color': 'black', opacity: '0.5', 'z-index':'5000'}
    }, options );

    var newSize;
    var clicked = false;
    var $sliiider = $(this);
    var $toggle = $(settings.toggle);
    var $exit = $(settings.exit_selector);
    var $body = $('body');
    var $shadow = $('<div id="sliiider-shadow"></div>');
    var bodySlideDistance;

    var bodyProp = {
      'reset': {
        transform: '',
        'overflow-x': '',
        transition: '',
        position: ''
      },
      slide: {
        setleft: function(distance) {
          this.left.activateAnimation.transform = 'translateX('+distance+'px)';
          this.left.deactivateAnimation.transform = 'translateX(0px)';
        },
        setright: function(distance) {
          this.right.activateAnimation.transform = 'translateX(-'+distance+'px)';
          this.right.deactivateAnimation.transform = 'translateX(0px)';
        },
        setbottom: function(distance) {
          this.bottom.activateAnimation.transform = 'translateY(-'+distance+'px)';
          this.bottom.deactivateAnimation.transform = 'translateY(0px)';
        },
        settop: function(distance) {
          this.top.activateAnimation.transform = 'translateY('+distance+'px)';
          this.top.deactivateAnimation.transform = 'translateY(0px)';
        },
        left: {
          activateAnimation: {transform:''},
          deactivateAnimation: {transform: ''}
        },
        right: {
          activateAnimation: {transform: ''},
          deactivateAnimation: {transform: ''}
        },
        top: {
          activateAnimation: {transform: ''},
          deactivateAnimation: {transform: ''}
        },
        bottom: {
          activateAnimation: {transform: ''},
          deactivateAnimation: {transform: ''}
        }
      },
      prepare: {
        position: 'relative', // to make overflow-x hidden work with mobile browsers
        'overflow-x': 'hidden',
      }
    };

    var shadowProp = {
      'reset': {
        width: '0',
        height: '0',
        visibility: 'hidden',
        opacity: '0'
      },
      prepare: {
        position: 'fixed',
        visibility: 'hidden',
        opacity: '0',
        transition: 'transform ' + settings.animation_duration + ' ' + settings.animation_curve  + ',' + ' opacity ' + settings.animation_duration + ' ' + settings.animation_curve,
        top: '0',
        left: '0',
        width: '0',
        height: '0',
        'background-color': settings.shadow_settings['background-color']
      },
      active: {
        visibility: 'visible',
        height: '100vh',
        width: '100vw',
        opacity: settings.shadow_settings.opacity,
        'z-index': settings.shadow_settings['z-index']
      },
      hide: {
       opacity: '0',
      }
    };

    var sliiiderProp = {
      prepare: {
        visibility: 'hidden',
        transition: 'transform ' + settings.animation_duration + ' ' + settings.animation_curve,
        position: 'fixed'
      },
      'reset': {
        transform: '',
        transition: '',
        width: '',
        height: '',
        left: '',
        top:'',
        bottom:'',
        right:''
      },
      slide: {
        left: {
          properties: function() {
            var left = '-' + $sliiider.width() + 'px';
            return {top: '0', left: left};
          },
          shadowActivateAnimation: function(distance) {return {transform: 'translateX('+distance+'px)'};},
          activateAnimation: {transform: 'translateX(100%)'},
          deactivateAnimation: {transform: 'translateX(0)'},
          size: function (wHeight, wWidth) {
            return {height: wHeight};
          }
        },
        right: {
          properties: function() {
            var right = '-' + $sliiider.width() + 'px';
            return {top: '0', right: right};
          },
          shadowActivateAnimation: function(distance) {return {transform: 'translateX('+ -distance +'px)'};},
          activateAnimation: {transform: 'translateX(-100%)'},
          deactivateAnimation: {transform: 'translateX(0)'},
          size: function (wHeight, wWidth) {
            return {height: wHeight};
          }
        },
        top: {
          properties: function() {
            var top = '-' + $sliiider.height() + 'px';
            return {left: '0', right:'0', top: top};
          },
          shadowActivateAnimation: function(distance) {return {transform: 'translateY('+ distance +'px)'};},
          activateAnimation: {transform: 'translateY(100%)'},
          deactivateAnimation: {transform: 'translateY(0)'},
          size: function (wHeight, wWidth) {
            return {width: wWidth};
          }
        },

        bottom: {
          properties: function() {
            var bottom = '-' + $sliiider.height() + 'px';
            return {left:0, right:0 , bottom: bottom};
          },
          shadowActivateAnimation: function(distance) {return {transform: 'translateY('+ -distance +'px)'};},
          activateAnimation: {transform: 'translateY(-100%)'},
          deactivateAnimation: {transform: 'translateY(0)'},
          size: function (wHeight, wWidth) {
            return {width: wWidth};
          }
        }
      }
    };

    var bodyChildrenProp = {
      prepare: {
        transition: 'transform ' + settings.animation_duration + ' ' + settings.animation_curve
      }
    };

    var htmlProp = {
      prepare: {
        'overflow-x': 'hidden'
      }
    };

    var prefixCSS = function(cssProp) {
      $.each(cssProp, function(k, v) {
        if(k === 'transition') {
          var trnsCSS = {};
          var trnsProp = v.split(' ',1)[0];
          var trnsAttr = v.split(' '); trnsAttr.shift(); trnsAttr = trnsAttr.join(' ');
          trnsCSS['-webkit-'+k] = '-webkit-' + trnsProp + ' ' + trnsAttr;
          trnsCSS['-ms-'+k] = '-ms-' + trnsProp + ' ' + trnsAttr;
          $.extend(cssProp, trnsCSS);
        }
        else if (k === 'transform') {
          var trnsfCSS = {};
          trnsfCSS['-webkit-'+k] = v;
          trnsfCSS['-ms-'+k] = v;
        }
      });
      return cssProp;
    };

    var siiize = function() {
      var windowSize = {};
      var scroll = getScrollBarWidth();
      windowSize.height = $(window).height();
      windowSize.width = $(window).width() + scroll;
      newSize = sliiiderProp.slide[settings.place].size(windowSize.height, windowSize.width);
      $sliiider.css(newSize);
      $sliiider.css(prefixCSS(sliiiderProp.slide[settings.place].properties()));
      setSlideDistance();
    };

    var setSlideDistance = function() {
      if(settings.body_slide || settings.shadow) {
        if(settings.place === 'right' || settings.place === 'left')
        {
          bodySlideDistance = $sliiider.width();
        }
        else
        {
          bodySlideDistance = $sliiider.height();
        }
      }
      if(settings.body_slide) {
        bodyProp.slide['set'+settings.place](bodySlideDistance);
      }
    };

    var prepare = function() {
      $sliiider.css(prefixCSS(sliiiderProp.prepare));
      $sliiider.css(prefixCSS(sliiiderProp.slide[settings.place].properties()));
      setSlideDistance();
      if(settings.shadow)
      {
        $shadow.css(prefixCSS(shadowProp.prepare));
      }
    };

    var getScrollBarWidth = function() {
      var inner = document.createElement('p');
      inner.style.width = "100%";
      inner.style.height = "200px";

      var outer = document.createElement('div');
      outer.style.position = "absolute";
      outer.style.top = "0px";
      outer.style.left = "0px";
      outer.style.visibility = "hidden";
      outer.style.width = "200px";
      outer.style.height = "150px";
      outer.style.overflow = "hidden";
      outer.appendChild(inner);

      document.body.appendChild(outer);
      var w1 = inner.offsetWidth;
      outer.style.overflow = 'scroll';
      var w2 = inner.offsetWidth;
      if (w1 === w2) { w2 = outer.clientWidth; }

      document.body.removeChild (outer);

      return (w1 - w2);
    };

  var activate = function() {
    siiize(); //sets the size of the slider menu and the distance the body will travel on sliding

    $sliiider.css('visibility','visible');
    if(settings.body_slide) {
        $body.css(prefixCSS(bodyProp.prepare));
        $('html').css(htmlProp.prepare);
        if(settings.shadow) {
          $shadow.css(shadowProp.active);
        }
        $body.children().not($shadow).css(prefixCSS(bodyChildrenProp.prepare));
        $body.children().css(prefixCSS(bodyProp.slide[settings.place].activateAnimation));
        if((ie !== false) && (ie <= 11)) {
            $sliiider.css(prefixCSS(sliiiderProp.slide[settings.place].activateAnimation));
        }
    }

    else {
      if(settings.shadow) {
        $shadow.css(prefixCSS(shadowProp.active));
        $shadow.css(prefixCSS(sliiiderProp.slide[settings.place].shadowActivateAnimation(bodySlideDistance)));
      }
      $sliiider.css(prefixCSS(sliiiderProp.slide[settings.place].activateAnimation));
    }

    if(settings.no_scroll)  {
      disable_scroll();
    }

    clicked = true;
  };

  var hideSlider = function(e) {
    $sliiider.css('visibility','hidden');
    $body.css(bodyProp['reset']);
    $('html').css(bodyProp['reset']);
    $body.unbind('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', hideSlider);
    prepare();
    if(settings.shadow) {
      $shadow.css(shadowProp['reset']);
    }
  };

  function deactivate() {

    $body.one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', hideSlider);

    if(settings.body_slide) {
      $body.children().css(prefixCSS(bodyProp.slide[settings.place].deactivateAnimation));
      if((ie !== false) && (ie <= 11))
        {$sliiider.css(prefixCSS(sliiiderProp.slide[settings.place].deactivateAnimation));}
    }

    else {
      $sliiider.css(prefixCSS(sliiiderProp.slide[settings.place].deactivateAnimation));
      if(settings.shadow) {
        $shadow.css(prefixCSS(sliiiderProp.slide[settings.place].deactivateAnimation));
      }
    }

    if(settings.shadow) {
      $shadow.css(shadowProp.hide);
    }

    if(settings.no_scroll)  {
      enable_scroll();
    }

    clicked = false;
  }

  siiize();
  prepare();
  $(window).resize(siiize);
  $sliiider.resize(siiize);
  if(!$body.children().is($shadow)) {
    $body.append($shadow);
  }

  var handleToggle = function() {
    if (!clicked)
    {activate();}
    else
    {deactivate();}
  };

  $toggle.click(handleToggle);
  $sliiider.find('a').on('click', function() {deactivate();});
  $exit.on('click', function() {deactivate();});
  $body.on('click', '#sliiider-shadow', function() {deactivate();});

  var deleteProp = function() {
    $body.css(bodyProp['reset']);
    $sliiider.css(sliiiderProp['reset']);
    $(window).off('resize', siiize);
    $toggle.off('click', handleToggle);
    $shadow.css(shadowProp['reset']);
    $shadow.remove();
  };


  var menu = {
    reset: function() {
      if(this.stateClicked()) {
        $body.one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', deleteProp);
        deactivate();
      }
      else {
        deleteProp();
      }
    },
    deactivate: function() {deactivate();},
    activate: function() {activate();},
    stateClicked: function() {return clicked;}
  };

  return menu;
};

//enable and disable scroll
// left: 37, up: 38, right: 39, down: 40,
// spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
var keys = {37: 1, 38: 1, 39: 1, 40: 1};

function preventDefault(e) {
  e = e || window.event;
  if (e.preventDefault)
  e.preventDefault();
  e.returnValue = false;
}

function preventDefaultForScrollKeys(e) {
  if (keys[e.keyCode]) {
    preventDefault(e);
    return false;
  }
}

function disable_scroll() {
  if (window.addEventListener) // older FF
  window.addEventListener('DOMMouseScroll', preventDefault, false);
  window.onwheel = preventDefault; // modern standard
  window.onmousewheel = document.onmousewheel = preventDefault; // older browsers, IE
  window.ontouchmove  = preventDefault; // mobile
  document.onkeydown  = preventDefaultForScrollKeys;
}

function enable_scroll() {
  if (window.removeEventListener)
  window.removeEventListener('DOMMouseScroll', preventDefault, false);
  window.onmousewheel = document.onmousewheel = null;
  window.onwheel = null;
  window.ontouchmove = null;
  document.onkeydown = null;
}

}(jQuery));
