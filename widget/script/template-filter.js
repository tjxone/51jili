template.defaults.imports.rateFormat = function(value) {
    return parseFloat(value)
}
template.defaults.imports.classifyFormat = function(value) {
    switch (value) {
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
    return value==0?Number(value).toFixed(2):value
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

template.defaults.imports.loandeadlineFormat = function(value){
    if (value.indexOf('月')>0)
        return `<em class="fs20">${value.slice(0,-2)}</em><i>个月</i>`
    else if (value.indexOf('天')>0){
        return `<em class="fs20">${value.slice(0,-1)}</em><i>天</i>`
    }
}

template.defaults.imports.repaymentPlanDataFormat = function(value){
    return new Date(Number(value)*1000).toLocaleDateString().replace(/\//g,"-")
}

template.defaults.imports.fromDate = function(value) {
    var value = new Date(value * 1000).toLocaleDateString().replace(/\//g, "-") + ' ' + new Date(value * 1000).toTimeString().substr(0, 8);
    return value;
}

template.defaults.imports.numberFormat = function(value){
    return value.replace(/\,/g,"")
}
