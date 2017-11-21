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
    var remainTime = value*1000-Date.parse(new Date())
    // var remainTime = new Date(timeStamp)
    var day = parseInt(remainTime/1000/60/60/24)
    var hour = parseInt((remainTime/1000/60/60)%24)
    var minute = parseInt((remainTime/1000/60)%60)
    var second = (remainTime/1000)%60

    var day = numFormat(day)
    var hour = numFormat(hour)
    var minute = numFormat(minute)
    var second = numFormat(second)

    return `<span class="time day">${day}</span><span>天 </span>
    <span class="time hour">${hour}</span><span>:</span>
    <span class="time minute">${minute}</span><span>:</span>
    <span class="time second">${second}</span>`
}

template.defaults.imports.detailDateFormat = function(value){
    var blankIndex = value.indexOf(' ');
    var detailDate = value.slice(0,blankIndex);
    var detailTime = value.slice(blankIndex);
    return `${detailDate}<em> ${detailTime}</em>`
}

template.defaults.imports.fix2 = function(value){
    return Number(value).toFixed(2)
}

template.defaults.imports.couponDateFormat = function(value){
    var couponDate = new Date(Number(value)*1000)
    var year = couponDate.getFullYear();
    var month = couponDate.getMonth()+1
    var day = couponDate.getDate()
    var hour = couponDate.getHours()
    var minute = couponDate.getMinutes()
     return `${year}-${month}-${day} ${hour}:${minute}`
}
