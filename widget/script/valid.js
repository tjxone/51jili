//每个正则是用&&来分割，正则对应消息也使用&&分割
jQuery.fn.valid = function(newParams){
        var defaultParams = {
            callback:function(msg,elm){
                console.log(msg)
            },
            isAllCheck:false
        }
        var param = Object.assign(defaultParams, newParams)
        var a = this[0]
        var temparr = {}
        var checkallarr = []
        var validPower = 1//其中一项不通过减一
        var requiredReg = new RegExp('required','g')
        var dataRegReg = new RegExp('dataReg','g')
        var checkGroupReg = new RegExp('checkGroup','g')
        var checkSingle = new RegExp('checkSingle','g')
        for(var i = 0;i<a.length;i++ ){
            if($(a[i]).attr('required')){
                temparr['required'+i] = a[i]
            }
            if($(a[i]).attr('data-reg')){
                temparr['dataReg'+i] = a[i]
            }
            if($(a[i]).attr('type')=='checkbox'&&$(a[i]).attr('check-class')){
                var name = $(a[i]).attr('check-class')
                if(typeof(temparr['checkGroup'+name])=='undefined'){
                    temparr['checkGroup'+name] = []
                }
                temparr['checkGroup'+name].push(a[i])
            }
            if($(a[i]).attr('type')=='checkbox'&&$(a[i]).attr('check-single')){
                temparr['checkSingle'+i] = a[i]
            }
        }

        for(var t in temparr){
            var inputElm = temparr[t]

            // required的
            if(requiredReg.test(t)){
                if($(inputElm).val()==''){
                    var requiredMsg = $(inputElm).attr('required-msg')
                    param.callback(requiredMsg,inputElm)
                    validPower--
                    return param.isAllCheck
                }
            }

            // data-reg的
            if(dataRegReg.test(t)){
                var regstr = $(inputElm).attr('data-reg')
                var regmsg = $(inputElm).attr('reg-msg')
                //分离每个正则
                var fengereg = new RegExp("&&","gi")
                if(fengereg.test(regstr)){
                    var regarr = regstr.split('&&')
                    var regMsgArr = regmsg.split('&&')
                    var tempPower = 1
                    //逐个正则匹配，不匹配则执行回调函数并跳出
                    $(regarr).each(function(i,r){
                        var reg = new RegExp(r,'g')
                        if(!reg.test($(inputElm).val())){
                            param.callback(regMsgArr[i],inputElm)
                            validPower--
                            tempPower--
                            return param.isAllCheck
                        }
                    })
                    if(tempPower<1){return false}//检验不通过，里面的循环跳出，外面循环跟住跳出
                }else{
                    var regsingle = new RegExp(regstr,'gi')
                    if(!regsingle.test($(inputElm).val())){
                        param.callback(regmsg,inputElm)
                        validPower--
                        return param.isAllCheck
                    }
                }
            }

            // checkGroup的
            if(checkGroupReg.test(t)){
                var msgswitch = 0;
                $(inputElm).each(function(index,elm){
                    if($(elm).prop('checked')){msgswitch++}
                })
                if(msgswitch==0){
                    var checkedMsg = '至少勾选'+$(inputElm[0]).attr('check-class')+'中的一项';
                    param.callback(checkedMsg,inputElm)
                    validPower--
                    return param.isAllCheck
                }
            }

            //checkSingle的
            if(checkSingle.test(t)){
                var checkSingleMsg = $(inputElm).attr('check-single-msg')
                if(!$(inputElm).prop('checked')){
                    param.callback(checkSingleMsg,inputElm);
                    validPower--
                    return param.isAllCheck
                }
            }

        }
        if(validPower<1){return false}else{return true}
    }
