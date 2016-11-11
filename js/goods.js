$(function(){
    var loadData = function(){
            $.ajax({
                url: "http://datainfo.duapp.com/shopdata/getGoods.php?callback=?",
                dataType: "jsonp",
                success: function(d){
                    if(d != null){
                        var len = d.length,
                            strHtml = "";
                        for(var i = 0; i < len; i++){
                            strHtml += '<figure>'
                                + '<img src="' + d[i].goodsListImg + '" title="' + d[i].goodsName + '" alt="' + d[i].goodsName + '" />'
                                + '<figcaption>'
                                + '<span class="name">' + d[i].goodsName + '</span>'
                                + '<span class="price">'
                                + '<em>￥<i>' + d[i].price + '</i></em>'
                                + '<i data-id="' + d[i].goodsID + '" class="icon">&#xe61b;</i>'
                                + '</span>'
                                + '</figcaption>'
                                + '</figure>';
                        }
                        $("#wrapper").html(strHtml);

                        cart.watchCart();
                    }
                }
            })
        },
        bindEvent = function(){
            $("#wrapper").on("tap", ".price i", function(e){
                var icon = $(this),
                    id = icon.attr("data-id"),
                    imgSrc = icon.closest("figcaption").prev("img").attr("src"),
                    price = icon.prev("em").children("i").text(),
                    name = icon.parent(".price").prev(".name").text(),
                    //cart = localStorage.getItem("cart"),
                    updateTime = (new Date).getTime();
                if(cart.lsCart == null){
                    cart.emptyLocalCart();
                }
                var count = cart.getGoodsCount(id);
                if (count > -1) {
                    cart.setGoodsCount(id, (count + 1));
                } else {
                    cart.addGoods({
                        id: id,
                        name: name,
                        img: imgSrc,
                        price: price,
                        count: 1
                    });
                }
                alert("添加成功!");
            });
            $("#hd").children(".cart").on("tap", function(e){
                window.location.href = "cart.html";
            })
        };
    cart.syncCart();
    loadData();
    bindEvent();
})