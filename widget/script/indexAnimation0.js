// 主页动画加载
 function drawCircle(){
    //canvas 画圆形
   function Circle() {
       this.radius = 130; // 圆环半径
       this.lineWidth = 15; // 圆环边的宽度
       this.strokeStyle = '#ccc'; //边的颜色
       this.fillStyle = 'hsla(0,100%,50%,1)'; //填充色
       this.lineCap = 'round';
   }

   Circle.prototype.draw = function(ctx, grd) {
       ctx.beginPath();
       ctx.arc(150, 150, this.radius, Math.PI * 0.25, Math.PI * 0.75, true); // 坐标为250的圆，这里起始角度是0，结束角度是Math.PI*2
       ctx.lineWidth = this.lineWidth;
       ctx.strokeStyle = this.strokeStyle;
       // ctx.globalCompositeOperation = 'source-over';
       ctx.lineCap = this.lineCap;
       ctx.stroke(); // 这里用stroke画一个空心圆，想填充颜色的童鞋可以用fill方法
   };

   function Ring(startAngle, percent) {
       Circle.call(this);
       this.startAngle = startAngle; //弧起始角度
       this.percent = percent; //弧占的比例
   }

   Ring.prototype = Object.create(Circle.prototype);

   Ring.prototype.drawRing = function(ctx, s) {
       this.draw(ctx, grd); // 调用Circle的draw方法画圈圈
       // angle
       var grd = ctx.createLinearGradient(0, 0, 300, 0);
       grd.addColorStop(0, "#ef4646");
       grd.addColorStop(1, "#fef504");
       ctx.beginPath();
       var anglePerSec = 2 * Math.PI / (75 / this.percent); // 蓝色的弧度
       ctx.arc(150, 150, this.radius, this.startAngle, 1.5 * Math.PI / (100 / s) + this.startAngle, false); //这里的圆心坐标要和cirle的保持一致
       ctx.strokeStyle = grd;
       // ctx.globalCompositeOperation = 'source-atop';
       ctx.lineCap = this.lineCap;
       ctx.stroke();
       ctx.closePath();
   }
   var canvas = document.getElementById('canvas');
   var ctx = canvas.getContext('2d');
   var schedule = $('#canvas').attr('data-value')
   var ring = new Ring(3 * Math.PI / 4, schedule); // 从3*Math.PI/4弧度开始，进度为50%的环
   var width = canvas.width,
       height = canvas.height;
   if (window.devicePixelRatio) {
       canvas.style.width = width + "px";
       canvas.style.height = height + "px";
       canvas.height = height * window.devicePixelRatio;
       canvas.width = width * window.devicePixelRatio;
       ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
   }
   var s = 0;
   var det = setInterval(function() {
       if (s <= schedule) {
           ring.drawRing(ctx, s);
           s++;
       } else {
           clearInterval(det);
       };
   }, 5)
  }
