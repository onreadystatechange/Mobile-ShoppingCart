$(function(){
    var showData = function(){
            var str = "";
            for(var i = 0; i < cart.goodsCount; i++){
                if(cart.goodsList[i]['count'] > 0){
                    str +=  '<li data-id="' + cart.goodsList[i]['id']+'" class="item">'
                        +'<img src="'+cart.goodsList[i]['img']+'">'
                        +'<i class="remove">删除</i>'
                        +'<p>'+cart.goodsList[i]['name']
                        +'<span class="price">'+cart.goodsList[i]['price']+'元'
                        +'</span>'
                        +'</p>'
                        +'<p>'
                        +'<i class="decrease">↓</i>'
                        +'<input value="'+cart.goodsList[i]['count']+'" class="num">'
                        +'<i class="add">↑</i>'
                        +'</p>'
                        +'</li>'
                }
            }
            $('#cart').html(str);
            //监视本地购物车数据的更新状态
            cart.watchCart(showData);
        },
        bindEvent = function(){
            $("#cart").on("click", ".decrease", function(e){
                var icon = $(this),
                    currId = icon.closest(".item").attr("data-id"),
                    $num = icon.next(".num"),
                    currVal = parseInt($num.val());
                if(currVal > 1){
                    $num.val(--currVal);
                    cart.setGoodsCount(currId, currVal);
                }
            })
            $("#cart").on("click", ".add", function(e){
                var icon = $(this),
                    currId = icon.closest(".item").attr("data-id"),
                    $num = icon.prev(".num"),
                    currVal = parseInt($num.val());
                if(currVal < 100){
                    $num.val(++currVal);
                    cart.setGoodsCount(currId, currVal);
                }
            })
            $("#cart").on("click", ".remove", function(e){
                var icon = $(this),
                    $item = icon.parent(".item"),
                    currId = $item.attr("data-id");

                if(confirm("您确定要删除我么？")){
                    $item.remove();
                    cart.setGoodsCount(currId, 0);
                }
            })
            $("#clear").on("click", function(e){
                if(confirm("您确定要删除我们么？")){
                    $("#cart").html("");
                    cart.setGoodsCount(0, 0, true);
                }
            })
        };
    cart.syncCart(showData);
/*
    showData();
    cart.updateCartToServer();
*/
    bindEvent();
})
