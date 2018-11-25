var vm = new Vue({
    el:"#app",
    data:{
        totalMoney:0,
        productList:[],
        checkAllFlag:false,
        delFlag:false,
        curProduct:0
    },
    filters:{
        formatMoney: function (value){
            return "¥ "+value.toFixed(2);
        }
    },
    mounted:function(){
        this.cartView();
    },
    methods:{
        cartView:function(){
            var _this = this;
            this.$http.get("data/cartData.json",{"id":123}).then(function(res){
                _this.productList = res.data.result.list;
            });
        },
        changeQuantity:function(product,way){
            if (way>0) {
				//加号增加数量
				product.productQuantity++;
				this.calcTotalPrice();//数量变动重新计算总金额
			} else{
				//减号减少数量，但是因为有删除按钮所以最小数量为1
				if(product.productQuantity < 2){
					product.productQuantity = 1;
				}else{
					product.productQuantity--;
					this.calcTotalPrice();//数量变动重新计算总金额
				}
			}
        },
        selectedProduct:function(item){
            if(typeof item.checked == 'undefined'){
                this.$set(item,"checked",true);  //局部$set方法，在item里注册ischecked属性，赋值为true
            }
            else{
                item.checked = !item.checked;  //点击反转属性值
            }
            this.calcTotalPrice();
        },
        checkAll:function(flag){
            this.checkAllFlag = flag;
            var _this = this;
            this.productList.forEach(function(item,index){
                if(typeof item.checked == 'undefined'){
                    _this.$set(item,"checked",_this.checkAllFlag);
                }
                else{
                    item.checked = _this.checkAllFlag;
                }
            });
            this.calcTotalPrice();
        },
        calcTotalPrice:function(){
            var _this = this;
            this.totalMoney = 0;   //每次计算前必须清零，防止出现累计计算
            this.productList.forEach(function(item,index){
                if(item.checked){
                    _this.totalMoney += item.productPrice * item.productQuantity;
                }
            });
        },
        delConfirm: function(item){
            this.delFlag=true;
            this.curProduct = item;
        },
        delProduct: function(){
            //indexOf方法接受一个值，在数组中进行检索这个值是否存在
            var index = this.productList.indexOf(this.curProduct);
            this.productList.splice(index,1);
            this.delFlag=false;
            this.calcTotalPrice();//删除商品后重新计算总金额
        }
    }
});