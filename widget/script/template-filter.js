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
    var day = remainTime.getDay();
    var hour = remainTime.getHours();
    var minute = remainTime.getMinutes();
    var second = remainTime.getSeconds();

    return `<span class="time day">${day}</span><span>天 </span>
    <span class="time hour">${hour}</span><span>:</span>
    <span class="time minute">${minute}</span><span>:</span>
    <span class="time second">${second}</span>`
}
