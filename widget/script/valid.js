//每个正则是用&&来分割，正则对应消息也使用&&分割
jQuery.fn.valid = function(newParams){
        var defaultParams = {
            callback:function(msg,this){
                console.log(msg)
            },
            isAllCheck:false
        }
        var param = Object.assign(defaultParams, newParams)
        var a = this[0]
        var temparr = []
        var checkallarr = []
        var validPower = 3
        for(var i = 0;i<a.length;i++ ){
            if($(a[i]).attr('data-reg')
            ||$(a[i]).attr('required')
            ||$(a[i]).attr('checked')){
                temparr.push(a[i])
            }
            if($(a[i]).attr('type')=='checkbox'){
                var checktemp = []
                checktemp.push($(a[i]).attr('name'))
                checktemp.push($(a[i])[0])
                checkallarr.push(checktemp)
            }
        }

        $(temparr).each(function(index,elm){
            //required的
            if($(this).attr('required')){
                if($(elm).val()==''){
                    var requiredMsg = $(this).attr('required-msg')
                    param.callback(requiredMsg,this)
                    validPower--
                    return param.isAllCheck
                }
            }
            //data-reg的
            if($(this).attr('data-reg')){
                var regstr = $(this).attr('data-reg')
                var regmsg = $(this).attr('reg-msg')
                //分离每个正则
                var fengereg = new RegExp("&&","gi")
                if(fengereg.test(regstr)){
                    var regarr = regstr.split('&&')
                    var regMsgArr = regmsg.split('&&')
                    var that = this;
                    //逐个正则匹配，不匹配则执行回调函数并跳出
                    $(regarr).each(function(i,r){
                        var reg = new RegExp(r,'g')
                        if(!reg.test($(that).val())){
                            param.callback(regMsgArr[i],,that)
                            validPower--
                            return param.isAllCheck
                        }
                    })
                }else{
                    var regsingle = new RegExp(regstr,'gi')
                    if(!regsingle.test($(this).val())){
                        param.callback(regmsg,this)
                        validPower--
                        return param.isAllCheck
                    }
                }
            }

            //checked的
            // 整理checkbox的数组
            var checktemp2 = [];
            var checkarr = [];
            if(checkallarr.length!=0){
                $(checkallarr).each(function(index,elm){
                    if(checktemp2.length==0){
                        checktemp2.push(elm)
                    }
                    if(checkallarr[index+1]!=undefined){
                        if(checkallarr[index][0]==checkallarr[index+1][0]){
                            checktemp2.push(checkallarr[index+1])
                        }else{
                            checkarr.push(checktemp2)
                            checktemp2 = [];
                        }
                    }else{
                        checkarr.push(checktemp2)
                    }
                })
            }

            $(checkarr).each(function(index,elm){
                var msgswitch = 0;
                $(elm).each(function(i,e){
                    // console.log($(e))
                    if($(e[1]).prop('checked')){msgswitch++}
                })
                if(msgswitch==0){
                    var checkedMsg = '至少勾选'+$(elm[0][1]).attr('checkclass')+'中的一项';
                    param.callback(checkedMsg,this)
                    validPower--
                    return param.isAllCheck
                }
            })
        })


        if(validPower<3){return false}else{return true}
    }
