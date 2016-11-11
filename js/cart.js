(function(){
    window.cart = {
        userID: "testing123456", //当前登录用户的id
        lsCart: null, //本地购物车数据
        updateTime: 0,
        goodsList: [],
        goodsCount: 0,
        startWatch: false, //是否已经开始监视购物车
        setCart: function(){
            //将当前购物车数据（存在lsCart里的）放入localstorage的方法（省得每次都写一长串串）
            localStorage.setItem("cart", JSON.stringify(this.lsCart));
        },
        init: function(){
            this.startWatch = false;
            this.getCartFromLocal();
        },
        getCartFromLocal: function(){
            //将localStorage里存储的购物车数据提取出来，
            //放到lsCart以及其他相关变量里
            //方便其他方法取用
            //这个初始化的过程，是在每次引入购物车的时候就要执行
            var strCart = localStorage.getItem("cart"),
                _this = this;
            //每次初始化的时候，先将监视购物车的监视状态设为false，
            //等真正监视购物车的代码执行的时候，再将它设置为true
            _this.lsCart = strCart == null ? null : JSON.parse(strCart);
            if(_this.lsCart != null){
                _this.updateTime = _this.lsCart.updateTime;
                _this.goodsList = _this.lsCart.goodsList;
                _this.goodsCount = _this.goodsList.length;
            }
        },
        emptyLocalCart: function(){
            //将localStorage里的完全null的cart格式初始化，
            //方便后面的函数统一向localStorage里添加数据
            this.lsCart = {
                updateTime: this.updateTime,
                goodsList: []
            }
            this.setCart();
        },
        syncCart: function(callback){
            // 同步本地与服务器端购物车数据
            // 需要判断 本地的 和 服务器端的 哪一套数据 比较新一些
            // （本地的传上去，或者把服务器端的down下来）
            var _this = this;
            $.ajax({
                url: "mock/getCartStatus.json",
                //上面这个json是自己模拟的一个接口，
                //用来提供服务器端的购物车更新时间，
                //真实的开发场景中需要后端同学去封装一个出来
                success: function(d){
                    if(d != null){
                        //对比两套数据的更新时间：
                        if(d.updateTime > _this.updateTime){
                            //服务器端的购物车数据更新一些
                            _this.updateTime = d.updateTime;
                            _this.getCartFromServer(callback);
                            //因为从服务器端拿数据过来的过程是一个异步的过程
                            //所以需要把 获取数据成功之后 需要做的事情 作为回调函数传过去
                        }else if(d.updateTime < _this.updateTime){
                            //本地的购物车数据更新一些
                            _this.updateCartToServer();
                            _this.getCartFromLocal();
                            if(callback){
                                //如果callback不为undefined
                                callback();
                            }
                        }else{
                            //服务器和本地的购物车数据一致，只需要执行回调函数就可以了。
                            if(callback){
                                callback();
                            }
                        }
                    }
                }
            });
        },
        updateCartToServer: function(){
            //把本地购物车数据同步到服务器端去。
            //因为接口的限制，我们只能一条一条的提交（这个逐条异步提交的过程是不好的）
            //真实的工作场景中，则需要与后端同学沟通，
            //请后端同学封装一个可以批量处理购物车的接口给我们
            var _this = this;
            this.goodsList.forEach(function(item, i, arr){
                $.ajax({
                    url: "http://datainfo.duapp.com/shopdata/updatecar.php",
                    data: {
                        userID: _this.userID,
                        goodsID: item.id,
                        number: item.count
                    },
                    success: function(d){
                        //console.log(d);
                    }
                })
            })
        },
        getCartFromServer: function(callback){
            //把服务器端购物车数据同步到本地来。
            var _this = this;
            $.ajax({
                url: "http://datainfo.duapp.com/shopdata/getCar.php?callback=?",
                data: { userID: _this.userID },
                dataType: "jsonp",
                success: function(data){
                    if(data == 0){
                        //如果data的值为0，表示没有购物车数据，则需要把本地购物车数据格式化
                        _this.emptyLocalCart();
                    }else if(data != null){
                        //如果查询到了购物车数据
                        //则需要把查询到的购物车数据里的每条商品属性
                        //选择性的提取出来，放到本地localStorage里
                        var list = [];
                        data.forEach(function(item, i, arr){
                            list.push({
                                id: item.goodsID,
                                name: item.goodsName,
                                img: item.goodsListImg,
                                price: item.price,
                                count: item.number
                            })
                        });
                        _this.goodsList = list;
                        _this.goodsCount = list.length;
                        _this.lsCart = {
                            updateTime: _this.updateTime,
                            goodsList: list
                        };
                        _this.setCart();
                        //购物车数据成功添加到localStorage之后，根据需要执行回调函数
                        if(callback){
                            callback();
                        }
                    }
                }
            })
        },
        setGoodsCount: function(id, count, setAll){
            //为指定的商品设定数量
            //id为指定的商品的id
            //count为将为设定的数量值
            //setAll表示需要同时将所有商品的数量同时更改
            var time = (new Date()).getTime();
            this.goodsList.forEach(function(item, i, arr){
                if(setAll || item.id == id){
                    //请注意这个判断条件,
                    //它表示，如果前面的条件满足了，就不需要判断后面的条件，直接执行下面的代码
                    //如果前面的条件不满足的时候，才需要根据后面的条件来决定是否执行下面的代码
                    item.count = count;
                    if(!setAll){
                        return false;
                    }
                }
            });
            this.updateTime = time;
            this.lsCart.updateTime = time;
            this.lsCart.goodsList = this.goodsList;
            //数据修改完成之后，需要将数据放本localStorage
            this.setCart();
        },
        getGoodsCount: function(id){
            //根据商品id来获取商品在本地购物车里的数量
            //id为要查询的商品的id
            var count = -1;
            this.goodsList.forEach(function(item, i, arr){
                if(item.id == id){
                    count = item.count;
                    return false;
                }
            });
            return parseInt(count);
            //如果没有找到对应的商品，则返回-1
        },
        addGoods: function(goods){
            //向购物车里添加新的商品
            this.goodsList.push(goods);
            this.goodsCount = this.goodsList.length;
            this.updateTime = (new Date).getTime();
            this.lsCart = {
                updateTime: this.updateTime,
                goodsList: this.goodsList
            };
            //添加完成之后，需要将数据放入localStorage里
            this.setCart();
        },
        watchCart: function(callback){
            //监视购物车更新状态
            //隔固定的时间间隔，去查看购物车的更新状态
            //以保证在不同的设备做操作的时候，可以达到同步的效果。
            if(!this.startWatch) {
                this.startWatch = true;
                var _this = this,
                    intv = setInterval(function () {
                        _this.getCartFromLocal();
                        _this.syncCart(callback);
                    }, 3000);
            }
        }
    };
    //初始化购物车数据
    cart.init();
})();