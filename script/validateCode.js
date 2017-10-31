function drawValidate(el){
  var CW = el.width;
  var CH = el.height;
  function randomNum(n,m){
    if (n===null)n=0;
    return Math.floor(Math.random()*(m-n+1)+n)
  }
  function randomColor(n,m){
    return `rgb(${randomNum(n,m)},${randomNum(n,m)},${randomNum(n,m)})`
  }
  var ctx = el.getContext("2d");
  var str = 'ABCDEFGHJKLMNPQRSTWXY3456789';
  var arrTxt = [],randomTxt='';

  // el.style.background=randomColor(230,240);
  ctx.fillStyle=randomColor(240,250);
  ctx.fillRect(0,0,CW,CH);
  ctx.textBaseline = 'top';
  for(var i=0;i<5;i++){
    ctx.fillStyle = randomColor(0,150);//字体颜色
    var fs=randomNum(CH/2,CH);
    ctx.font = `${fs}px SimHei`;//字体大小
    ctx.save();//保存状态
    //添加随机偏移距离
    if(i==0){
      var tempD = randomNum(CW/20,CW/10);
    }else{
      var tempD = randomNum(-CW/20,CW/10);
    }
    ctx.translate((CW/5)*i+CW/10+tempD,(CH/2)+randomNum(-5,5));//移动位置
    ctx.rotate(randomNum(-20,20)*Math.PI/180);//随机角度
    //生成随机文字
    var txt = str[randomNum(0,str.length-1)];
    arrTxt.push(txt);
    ctx.fillText(txt,-fs/2,-fs/2);//随机文字
    ctx.restore();
  }
  randomTxt = arrTxt.join('');
  //绘制干扰线
  for(var k=0;k<10;k++){
    ctx.beginPath();
    ctx.moveTo(randomNum(0,CW),randomNum(0,CH));
    ctx.lineTo(randomNum(0,CW),randomNum(0,CH));
    ctx.strokeStyle = randomColor(0,200);
    ctx.stroke();
  }
  //绘制圆点
  for(var j=0;j<200;j++){
    ctx.beginPath();
    ctx.arc(randomNum(0,CW),randomNum(0,CH),1,0,2*Math.PI);
    ctx.fillStyle=randomColor(100,190);
    ctx.fill();
  }
  return randomTxt;
}
