$(function(){
	//读取localstorage里面的东西
	var cartStr = localStorage.getItem("cart"),
	    cart = cartStr == null ? null : JSON.parse(cartStr),
		goodsList = cart == null ? [] : cart.goodsList,
	    len = goodsList.length,
		key;
	
	console.log(cart)
	//存入localstorage
	var putlocal = function(value,index){
		goodsList[index]['count'] = value;
		localStorage.setItem("cart", JSON.stringify(cart));
		},
	    //提交到服务器
	    server = function(){
		 goodsList.forEach(function(item, i, arr){
            $.ajax({
                url: "http://datainfo.duapp.com/shopdata/updatecar.php",
                data: {
                    userID: "testing123456",
                    goodsID: item.id,
                    number: item.count
                },
                success: function(d){
                    console.log(d);
                }
            })
        })
        },
	    //删除
	    serverdel = function(){
		    goodsList.forEach(function(item, i, arr){
            $.ajax({
                url: "http://datainfo.duapp.com/shopdata/updatecar.php",
                data: {
                    userID: "testing123456",
                    goodsID: item.id,
                    number: 0
                },
                success: function(d){
                    console.log(d);
                }
            })
        })
        },
	//拼接并放入页面
        loadData = function(){
		var str = "";
		for(var i=0;i<len;i++){
			str +=  '<li data-id="'+goodsList[i]['id']+'" class="item">'
			     	+'<img src="'+goodsList[i]['img']+'">'
			     	+'<i class="remove">删除</i>'
			     	+'<p>'+goodsList[i]['name']
			     	+'<span class="price">'+goodsList[i]['price']+'元'
			     	+'</span>'
			     	+'</p>'
			     	+'<p>'
			    	+'<i class="decrease">↓</i>'
			    	+'<input value="'+goodsList[i]['count']+'" class="num">'
			    	+'<i class="add">↑</i>'
			     	+'</p>'
			    	+'</li>'
		}
		
		$('#cart').append(str);
		
	};
	loadData();
	//加加减减改变localstorage里面的数量，上限为15,单价总价跟着改变，价格保留两位小数
	var inCrease=function(){
		
		$('#cart').on('click','.add',function(e){
			var index = $(this).parents('.item').index();
			var value = $(this).prev().val();
			value++;
			if(value>=20){
				value = 20;
			}
			putlocal(value,index);
			console.log(cart)
			$(this).prev().val(value);
			allPrice()
		})
		$('#cart').on('click','.decrease',function(e){
			var value = $(this).next().val();
			var index = $(this).index();
			console.log(index)
			console.log(value)
			value--;
			putlocal(value,index);
			if(value<=1){
				value = 1;
			}
			$(this).next().val(value);
			allPrice()
		})
	}
	inCrease();
	//总价等于相加
    var allPrice = function(){
		var item = $('.item');
		var arr = 0;
		for(var i=0;i<item.length;i++){
			arr += parseInt(item.eq(i).find('.num').val())*parseInt(item.eq(i).find('.price').html())
		}
		$('#total').html(arr+'元')
	};
	allPrice();
	//点击删除出现confirm框，判断用户操作，移除dom元素，移除localstorage里面删除的产品,服务器也要移出,并且刷新时间
	var remove = function(){
		$('#cart').on('click','.remove',function(){
			if(confirm('确认删除吗')){
				var key = $(this).parents('.item').index();
				console.log(key)
				$(this).parents('.item').remove();
				goodsList.splice(key,1);
				console.log(goodsList);
				localStorage.setItem("cart", JSON.stringify(cart));
				server();
				allPrice();
			};			
		})
	}
	remove();
	//点击清空时直接清空所有页面，并且提交到服务器
	var clear = function(){
		$('#clear').click(function(){
			cart.updateTime = (new Date()).getTime();
			$('#cart').html('');
			serverdel();
			goodsList.splice(0,goodsList.length);
			localStorage.setItem("cart", JSON.stringify(cart));
			$('#total').html('0元');
			window.location.href='cart.html'
		})
	}
	clear();
})
