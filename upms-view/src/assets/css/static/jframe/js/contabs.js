var EntID = "881684766236";
var UserID = "";
var IPAddress = "111.207.141.210";
var AppVersion = "201803131653";

$(function () {
  function t(t) {
    var e = 0;
    return $(t).each(function () {
      e += $(this).outerWidth(!0)
    }),
      e
  }

  function e(e) {
    var a = t($(e).prevAll()),
      i = t($(e).nextAll()),
      n = t($(".content-tabs").children().not(".J_menuTabs")),
      s = $(".content-tabs").outerWidth(!0) - n,
      r = 0;
    if ($(".page-tabs-content").outerWidth() < s)
      r = 0;
    else if (i <= s - $(e).outerWidth(!0) - $(e).next().outerWidth(!0)) {
      if (s - $(e).next().outerWidth(!0) > i) {
        r = a;
        for (var o = e; r - $(o).outerWidth() > $(".page-tabs-content").outerWidth() - s;)
          r -= $(o).prev().outerWidth(), o = $(o).prev()
      }
    } else
      a > s - $(e).outerWidth(!0) - $(e).prev().outerWidth(!0) && (r = a - $(e).prev().outerWidth(!0));
    $(".page-tabs-content").animate({
      marginLeft: 0 - r + "px"
    }, "fast")
  }

  function a() {
    var e = Math.abs(parseInt($(".page-tabs-content").css("margin-left"))),
      a = t($(".content-tabs").children().not(".J_menuTabs")),
      i = $(".content-tabs").outerWidth(!0) - a,
      n = 0;
    if ($(".page-tabs-content").width() < i)
      return !1;
    for (var s = $(".J_menuTab:first"), r = 0; r + $(s).outerWidth(!0) <= e;)
      r += $(s).outerWidth(!0), s = $(s).next();
    if (r = 0, t($(s).prevAll()) > i) {
      for (; r + $(s).outerWidth(!0) < i && s.length > 0;)
        r += $(s).outerWidth(!0), s = $(s).prev();
      n = t($(s).prevAll())
    }
    $(".page-tabs-content").animate({
      marginLeft: 0 - n + "px"
    }, "fast")
  }

  function i() {
    var e = Math.abs(parseInt($(".page-tabs-content").css("margin-left"))),
      a = t($(".content-tabs").children().not(".J_menuTabs")),
      i = $(".content-tabs").outerWidth(!0) - a,
      n = 0;
    if ($(".page-tabs-content").width() < i)
      return !1;
    for (var s = $(".J_menuTab:first"), r = 0; r + $(s).outerWidth(!0) <= e;)
      r += $(s).outerWidth(!0), s = $(s).next();
    for (r = 0; r + $(s).outerWidth(!0) < i && s.length > 0;)
      r += $(s).outerWidth(!0), s = $(s).next();
    n = t($(s).prevAll()),
    n > 0 && $(".page-tabs-content").animate({
      marginLeft: 0 - n + "px"
    }, "fast")
  }

  function n() {
    var t = $(this).attr("url"),
      a = $(this).data("index"),
      i = $.trim($(this).text()),
      n = !0,
      id = t;
    UserID = new Date().getTime();
    if (t.indexOf("?") > 0) {
      t = t + "&EntID=" + EntID + "&UserID=" + UserID;
    }
    else {
      t = t + "?EntID=" + EntID + "&UserID=" + UserID;
    }

    //首页直接打开首页，不刷新页面
    if (t == "../CustSysHome/Index?EntID=" + EntID + "&UserID=" + UserID) {
      $(".J_menuTabs .J_menuTab").eq(0).click();
      if ($(this).attr("IsMenu") != "0") {
        if ($(this).parent().parent().parent().attr("secondnav") == "true") {
          $("#side-menu>li").removeClass("active");
          $(this).parent().parent().parent().parent().parent().addClass("active");
        }
        else {
          $("#side-menu>li").removeClass("active");
          $(this).parent().parent().parent().addClass("active");
        }
      }
      return;
    }

    if (void 0 == t || 0 == $.trim(t).length)
      return !1;
    if ($(".J_menuTab").each(function () {
        return $(this).data("id") == id ? ($(this).hasClass("active") || ($(this).addClass("active").siblings(".J_menuTab").removeClass("active"), e(this), $(".J_mainContent .J_iframe").each(function () {
          return $(this).data("id") == id ? ($(this).show().siblings(".J_iframe").hide(), !1) : void 0
        })), n = !1, !1) : void 0
      }), n) {
      var s = '<a href="javascript:;" class="active J_menuTab" data-id="' + id + '" data-toggle="tooltip" title="双击刷新页面"><span></span>' + i + ' <i>×</i></a>';
      $(".J_menuTab").removeClass("active");
      var r = '<iframe class="J_iframe" name="iframe' + a + '" width="100%" height="100%" src="' + t + '" frameborder="0" data-id="' + id + '" seamless></iframe>';
      $(".J_mainContent").find("iframe.J_iframe").hide().parents(".J_mainContent").append(r);
      //HBBBase.blockUI();
      $(".J_mainContent iframe:visible").load(function () {
        //HBBBase.unblockUI();
        console.log(123455);
      }),
        $(".J_menuTabs .page-tabs-content").append(s),
        e($(".J_menuTab.active"))
      /*$(".J_mainContent iframe:visible").attr('src','');
      $(".J_mainContent iframe:visible").attr('src',t);
      $(".J_mainContent iframe:visible")[0].contentWindow.location.reload(true);*/
    }

    if ($(this).attr("IsMenu") != "0") {
      if ($(this).parent().parent().parent().attr("secondnav") == "true") {
        $("#side-menu>li").removeClass("active");
        $(this).parent().parent().parent().parent().parent().addClass("active");
      }
      else {
        $("#side-menu>li").removeClass("active");
        $(this).parent().parent().parent().addClass("active");
      }
    }
    return !1
  }

  function s() {
    var t = $(this).parents(".J_menuTab").data("id"),
      a = $(this).parents(".J_menuTab").width();
    if ($(this).parents(".J_menuTab").hasClass("active")) {
      if ($(this).parents(".J_menuTab").next(".J_menuTab").size()) {
        var i = $(this).parents(".J_menuTab").next(".J_menuTab:eq(0)").data("id");
        $(this).parents(".J_menuTab").next(".J_menuTab:eq(0)").addClass("active"),
          $(".J_mainContent .J_iframe").each(function () {
            return $(this).data("id") == i ? ($(this).show().siblings(".J_iframe").hide(), !1) : void 0
          });
        var n = parseInt($(".page-tabs-content").css("margin-left"));
        0 > n && $(".page-tabs-content").animate({
          marginLeft: n + a + "px"
        }, "fast"),
          $(this).parents(".J_menuTab").remove(),
          $(".J_mainContent .J_iframe").each(function () {
            return $(this).data("id") == t ? ($(this).remove(), !1) : void 0
          })
      }
      if ($(this).parents(".J_menuTab").prev(".J_menuTab").size()) {
        var i = $(this).parents(".J_menuTab").prev(".J_menuTab:last").data("id");
        $(this).parents(".J_menuTab").prev(".J_menuTab:last").addClass("active"),
          $(".J_mainContent .J_iframe").each(function () {
            return $(this).data("id") == i ? ($(this).show().siblings(".J_iframe").hide(), !1) : void 0
          }),
          $(this).parents(".J_menuTab").remove(),
          $(".J_mainContent .J_iframe").each(function () {
            return $(this).data("id") == t ? ($(this).remove(), !1) : void 0
          })
      }
    } else
      $(this).parents(".J_menuTab").remove(), $(".J_mainContent .J_iframe").each(function () {
        return $(this).data("id") == t ? ($(this).remove(), !1) : void 0
      }), e($(".J_menuTab.active"));

    $("#side-menu .J_menuItem").each(function () {
      if ($(this).attr("url") == t) {
        $(this).parent().removeClass("active");
        return !1
      }
    });
    return !1
  }

  function r() {
    $(".page-tabs-content").children("[data-id]").not(":first").not(".active").each(function () {
      $('.J_iframe[data-id="' + $(this).data("id") + '"]').remove(),
        $(this).remove();

      var ThisUrl = $(this).data("id");
      $("#side-menu .J_menuItem").each(function () {
        if ($(this).attr("url") == ThisUrl) {
          $(this).parent().removeClass("active");
        }
      });
    }),
      $(".page-tabs-content").css("margin-left", "0")
  }

  function o() {
    e($(".J_menuTab.active"))
  }

  function d() {
    if (!$(this).hasClass("active")) {
      var t = $(this).data("id");
      $(".J_mainContent .J_iframe").each(function () {
        return $(this).data("id") == t ? ($(this).show().siblings(".J_iframe").hide(), !1) : void 0
      }),
        $(this).addClass("active").siblings(".J_menuTab").removeClass("active"),
        e(this)
    }
  }

  function c() {
    var t = $('.J_iframe[data-id="' + $(this).data("id") + '"]'),
      e = t.attr("src");
    //a = layer.load();
    t.attr("src", e).load(function () {
      //layer.close(a)
    })
  }

  $(".J_menuItem").each(function (t) {
    $(this).attr("data-index") || $(this).attr("data-index", t)
  }),
    $("#app").on("click", '.J_menuItem', n),
    $("#app").on("click", ".J_menuTab i", s),//.J_menuTabs
    $("#app").on("click", '.J_tabCloseOther', r),
    $("#app").on("click", '.J_tabShowActive', o),
    $("#app").on("click", ".J_menuTab", d),//J_menuTabs
    $("#app").on("dblclick", ".J_menuTab", c),//J_menuTabs
    $("#app").on("click", '.J_tabLeft', a),
    $("#app").on("click", '.J_tabRight', i),
    $("#app").on("click", '.J_tabCloseAll', function () {
      $(".page-tabs-content").children("[data-id]").not(":first").each(function () {
        $('.J_iframe[data-id="' + $(this).data("id") + '"]').remove(),
          $(this).remove();
        $("#side-menu .sub-menu>li").removeClass("active");
      }),
        $(".page-tabs-content").children("[data-id]:first").each(function () {
          $('.J_iframe[data-id="' + $(this).data("id") + '"]').show(),
            $(this).addClass("active")
        }),
        $(".page-tabs-content").css("margin-left", "0")
    })
});
