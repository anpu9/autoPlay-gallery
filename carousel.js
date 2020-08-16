(function ($) {
  var Carousel = function (obj) {
    var self = this;
    this.poster = obj;
    this.posterItemMain = obj.find("ul.poster-list");
    this.nextBtn = obj.find("div.poster-next-btn");
    this.prevBtn = obj.find("div.poster-prev-btn");
    this.posterItems = this.poster.find("li.poster-item");
    this.posterFirstItem = this.posterItems.first();
    this.posterLastItem = this.posterItems.last();
    // 默认配置
    this.setting = {
      width: 1000, //幻灯片宽度
      height: 270, //幻灯片高度
      posterWidth: 640, //幻灯片第一帧宽度
      posterHeight: 270, //幻灯片第一帧高度
      scale: 0.9, //记录显示关系
      verticalAlign: "buttom",
      speed: 500,
      autoPlay: true,
      delay: 2000,
    };
    this.rotateFlag = true;
    //设置参数值
    $.extend(this.setting, this.getSetting());
    
    //是否开启自动播放
    if (this.setting.autoPlay) {
      this.autoPlay();
      this.poster.hover(function(){
        clearInterval(self.timer);
      },function(){
        self.autoPlay();
      });
    }
    this.setSettingValue();
    this.setPosterPos();
    this.nextBtn.click(function () {
      if (self.rotateFlag) {
        self.rotateFlag = false;
        self.carouselRotate("left");
      }
    });
    this.prevBtn.click(function () {
      if (self.rotateFlag) {
        self.rotateFlag = false;
        self.carouselRotate("right");
      }
    });
  };
  Carousel.prototype = {
    
    autoPlay:function(){
      var self=this;
     this.timer= window.setInterval(function(){
self.nextBtn.click();
      },this.setting.delay);
    },
    carouselRotate: function (dir) {
      var _this_ = this;
      if (dir === "left") {
        this.posterItems.each(function () {
          var self = $(this),
            prev = self.prev().get(0) ? self.prev() : _this_.posterLastItem,
            width = prev.width(),
            height = prev.height(),
            zIndex = prev.css("zIndex"),
            opacity = prev.css("opacity"),
            left = prev.css("left"),
            top = prev.css("top");
          self.animate(
            {
              width: width,
              height: height,
              zIndex: zIndex,
              opacity: opacity,
              left: left,
              top: top,
            },
            _this_.setting.speed,
            function () {
              _this_.rotateFlag = true;
            }
          );
        });
      } else if (dir === "right") {
        this.posterItems.each(function () {
          var self = $(this),
            next = self.next().get(0) ? self.next() : _this_.posterFirstItem,
            width = next.width(),
            height = next.height(),
            zIndex = next.css("zIndex"),
            opacity = next.css("opacity"),
            left = next.css("left"),
            top = next.css("top");
          self.animate(
            {
              width: width,
              height: height,
              zIndex: zIndex,
              opacity: opacity,
              left: left,
              top: top,
            },
            _this_.setting.speed,
            function () {
              _this_.rotateFlag = true;
            }
          );
        });
      }
    },
    setPosterPos: function () {
      var _self = this;
      var level = Math.floor(this.posterItems.length / 2);

      var sliceItems = this.posterItems.slice(1),
        sliceSize = sliceItems.length / 2,
        rightSlice = sliceItems.slice(0, sliceSize);
      leftSlice = sliceItems.slice(sliceSize, sliceItems.length + 1);

      var rw = this.setting.posterWidth,
        rh = this.setting.posterHeight,
        gap = (this.setting.width - this.setting.posterWidth) / 2 / level;
      var firstLeft = (this.setting.width - this.setting.posterWidth) / 2;
      var fixOffsetLeft = rw + firstLeft;
      //设置右边帧的位置关系和宽度高度
      rightSlice.each(function (i) {
        level--;
        rw = rw * _self.setting.scale;
        rh = rh * _self.setting.scale;
        var j = i;
        $(this).css({
          zIndex: level,
          width: rw,
          height: rh,
          opacity: 1 / ++i,
          left: fixOffsetLeft - rw + gap * ++j,
          top: _self.setVerticalAlign(rh),
        });
      });
      var lw = rightSlice.last().width(),
        lh = rightSlice.last().height(),
        oloop = Math.floor(this.posterItems.length / 2);
      leftSlice.each(function (i) {
        $(this).css({
          zIndex: level,
          width: lw,
          height: lh,
          opacity: 1 / oloop,
          left: gap * i,
          top: _self.setVerticalAlign(lh),
        });

        oloop--;
        lw = lw / _self.setting.scale;
        lh = lh / _self.setting.scale;
      });
    },
    //设置剩余的帧的位置
    setVerticalAlign: function (height) {
      var verticalType = this.setting.verticalAlign;
      var top;
      if (verticalType === "middle") {
        top = (this.setting.height - height) / 2;
      } else if (verticalType === "top") {
        top = 0;
      } else if (verticalType === "bottom") {
        top = this.setting.height - height;
      } else {
        top = (this.setting.height - height) / 2;
      }

      return top;
    },
    //设置配置参数值控制基本的宽度高度
    setSettingValue: function () {
      this.poster.css({
        width: this.setting.width,
        height: this.setting.height,
      });
      this.posterItemMain.css({
        width: this.setting.width,
        height: this.setting.height,
      });
      //计算按钮宽度
      var w = (this.setting.width - this.setting.posterWidth) / 2;

      this.nextBtn.css({
        width: w,
        height: this.setting.height,
        zIndex: Math.ceil(this.posterItems.length / 2),
      });
      this.prevBtn.css({
        width: w,
        height: this.setting.height,
        zIndex: Math.ceil(this.posterItems.length / 2),
      });
      this.posterFirstItem.css({
        left: w,
        zIndex: Math.floor(this.posterItems.length / 2),
        width: this.setting.posterWidth,
        height: this.setting.posterHeight,
      });
    },
    //   获取人工配置参数
    getSetting: function () {
      var setting = this.poster.attr("data-setting");
      if (setting && setting != "") {
        return $.parseJSON(setting);
      } else {
        return {};
      }
    },
  };
  Carousel.init = function (posters) {
    var _this_ = this;
    posters.each(function () {
      new _this_($(this));
    });
  };
  window["Carousel"] = Carousel;
})(jQuery);
