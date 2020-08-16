# autoPlay-gallery

>慕课网的课程，详见[散廊](https://www.imooc.com/video/7532)

-----
##知识点

* CSS
   * 定位、层级、透明度
* JS
   * 类的封装
      1.新类名//注意定义新类后要在全局激活？ **window["类名"]=类名**
      2.类型.prototype
      3.封装一个同时jquery化的init方法  
      ` Carousel.init = function (posters) {
    var _this_ = this;
    posters.each(function () {
      new _this_($(this));
    });`
   * this:注意this的飘移，必要时应提前保存
   * 参数配置
   * 位置关系分析(循环的逻辑)
   * 旋转分析，获取兄弟节点的属性，属性名=兄弟节点的属性    
   ``` this.posterItems.each(function () {
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
        });```
    * .next() .prev() .animate(属性集合，speed,函数) .find() children,事件
