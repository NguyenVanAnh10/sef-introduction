let scroll_distance = 500;
let transparent = true;
let right_navbar_initialized = false;

$(document).ready(function () {
  $navbar = $(".navbar[color-on-scroll]");

  scroll_distance = $navbar.attr("color-on-scroll") || 500;
  seftIntro.initRightMenu();
});

function debounce(func, wait, immediate) {
  var timeout;
  return function () {
    var context = this,
      args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    }, wait);
    if (immediate && !timeout) func.apply(context, args);
  };
}
function isElementInViewport(elem) {
  var $elem = $(elem);

  // Get the scroll position of the page.
  var scrollElem =
    navigator.userAgent.toLowerCase().indexOf("webkit") != -1 ? "body" : "html";
  var viewportTop = $(scrollElem).scrollTop();
  var viewportBottom = viewportTop + $(window).height();

  // Get the position of the element on the page.
  var elemTop = Math.round($elem.offset().top);
  var elemBottom = elemTop + $elem.height();

  return elemTop < viewportBottom && elemBottom > viewportTop;
}

const seftIntro = {
  openRightMenuToggle: false,
  checkScrollForParallax: debounce(function () {
    $(".parallax").each(function () {
      var $elem = $(this);

      if (isElementInViewport($elem)) {
        var parent_top = $elem.offset().top;
        var window_bottom = $(window).scrollTop();
        var $image = $elem.children(".bg-cover-parallax");

        oVal = (window_bottom - parent_top) / 3;
        $image.css("transform", "translate3d(0px, " + oVal + "px, 0px)");
      }
    });
  }, 6),
  checkScrollForTransparentNavbar: debounce(function () {
    if ($(document).scrollTop() > scroll_distance) {
      if (transparent) {
        transparent = false;
        $navbar.addClass("navbar-light");
        $navbar.addClass("bg-light");
        $navbar.removeClass("navbar-dark");
        $navbar.addClass("border-bottom");
      }
    } else {
      if (!transparent) {
        transparent = true;
        $navbar.removeClass("navbar-light");
        $navbar.removeClass("bg-light");
        $navbar.removeClass("border-bottom");
        $navbar.addClass("navbar-dark");
      }
    }
  }, 17),

  initRightMenu: function () {
    $toggle = $(".navbar-toggler");

    $toggle.click(function () {
      console.log(
        "seftIntro.openRightMenuToggle",
        seftIntro.openRightMenuToggle
      );
      if (seftIntro.openRightMenuToggle) {
        seftIntro.openRightMenuToggle = false;
        $("body").removeClass("nav-open");
        $("#bodyClick").remove();
      } else {
        seftIntro.openRightMenuToggle = true;
        $("body").addClass("nav-open");
        const div = '<div id="bodyClick"></div>';
        $(div)
          .appendTo("body")
          .click(function () {
            $("#bodyClick").remove();
            $("body").removeClass("nav-open");
            seftIntro.openRightMenuToggle = false;
          });
      }
    });
  },
};

$(window).resize(function () {
  if ($(window).width() < 992) {
    debounce(seftIntro.initRightMenu, 300);
  }
});

$(window).on("scroll", function () {
  seftIntro.checkScrollForTransparentNavbar();

  seftIntro.checkScrollForParallax();
});

$('a[data-scroll="true"]').click(function (e) {
  var scroll_target = $(this).data("id");
  var scroll_trigger = $(this).data("scroll");

  if (scroll_trigger == true && scroll_target !== undefined) {
    e.preventDefault();

    $("html, body").animate(
      {
        scrollTop: $(scroll_target).offset().top - 50,
      },
      1000
    );
  }
});
