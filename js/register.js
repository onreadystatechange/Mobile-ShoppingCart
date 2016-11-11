$(function(){
    $("#reg").on("tap", function(e){
        e.preventDefault();
        var $username = $("#username"),
            $pwd = $("#pwd"),
            $pwd_rpt = $("#pwd_rpt");
        if($username[0].checkValidity()){
            if($pwd[0].checkValidity()){
                if($pwd_rpt[0].checkValidity()){
                    if($pwd.val() == $pwd_rpt.val()){
                        //loding显示
                        $.ajax({
                            url: "http://datainfo.duapp.com/shopdata/userinfo.php",
                            data: {
                                status: "register",
                                userID: $username.val(),
                                password: $pwd.val()
                            },
                            success: function(d){
                                //loding隐藏
                                console.log(d);
                                switch (d){
                                    case "0" : alert("重名"); break;
                                    case "1" : alert("成功"); location.href="goods.html"; break;
                                    case "2" : alert("服务器出错，请重试！"); break;
                                    default: alert("blabla"); break;
                                }
                            }
                        })
                    }
                    else{
                        alert("密码不一致！");
                    }
                }else{
                    alert("重复密码至少6位！");
                }
            }else{
                alert("密码至少6位！");
            }
        }else{
            alert("账号格式不对！");
            /////$usernam
        }
    })
    $("#postNo").on("tap", function(e){
        //倒计时开始，写在$(this)上
        $.ajax({
            url: "mock/phoneCheck.json",
            data: {phoneNo: $("#username").val()},
            success: function(d){
                if(d.status == 0){
                    alert("验证码获取失败，请重试！");
                    //倒计时结束，可以重新获取
                }else{
                    alert("验证码已发送！");
                }
            }
        })
    })
    $("#check").on("tap", function(){
        $.ajax({
            url: "mock/checking.json",
            data: {phoneNo: $("#username").val(), checkNo: $("#checkNo").val()},
            success: function(d){
                if(d.status == 0){
                    alert("验证码输入有误，请重试！");
                    //倒计时结束，可以重新获取
                }else{
                    alert("验证成功！");
                }
            }
        })
    })
});