template.defaults.imports.rateFormat = function(value){
    return parseFloat(value)
}
template.defaults.imports.classifyFormat = function(value){
    switch (value){
      case 'pubtime':
      return '期限'
      break;
      case 'rate':
      return '收益'
      break;
      case 'bdtype':
      return '项目'
      break;
    }
}
template.defaults.imports.effectiveDateFormat = function(value){
    // var date = new Date(parseInt(value*1000));
    var timeStamp = value*1000-Date.parse(new Date())
    var remainTime = new Date(timeStamp)
    alert(remainTime)
    var day = parseInt(remainTime/1000/60/60/24)
    var hour = parseInt((remainTime/1000/60/60)%24)
    var minute = parseInt((remainTime/1000/60)%60)
    var second = (remainTime/1000)%60

    var day = day<10? ('0'+day):day
    var hour = hour<10? ('0'+hour):hour
    var minute = minute<10? ('0'+minute):minute
    var second = second<10? ('0'+second):second

    return `<span class="time day">${day}</span><span>天 </span>
    <span class="time hour">${hour}</span><span>:</span>
    <span class="time minute">${minute}</span><span>:</span>
    <span class="time second">${second}</span>`
}
