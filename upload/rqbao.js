var withdrawNumFlag;
$(function(){
	var withdrawNumFlag=true;
	$("#withdrawNum").bind({
		keyup: function() {
		withdrawNumFlag = false;
		var pattern = /^(([1-9]\d{0,9})|0)(\.\d{1,2})?$/;
		var account = parseFloat($(this).val());
		var accountBalance = parseFloat($("#accountBalance").val());
		var userId = $("#userId").val();
		if(accountBalance>=100){
			if (!account){
				$("#poundage font").text(Number(0));
			}else if(!validateNumberic($(this)) || !(account >= 100) || !pattern.test(account)){
				$(this).siblings(".withdrawNum").addClass("error").text("请输入正确的提现金额!");
				return;
			}else if(accountBalance< parseFloat($(this).val())){
				$(this).siblings(".withdrawNum").addClass("error").text("提现金额必须小于可提现金额");
				return;
			}else{	
				$(this).siblings(".withdrawNum").removeClass("error").text("元");
				var cashYield = Number($("#cashYield").val());/*手续费利率*/
				var poundageNum = (Number($(this).val())*cashYield).toFixed(2);/*手续费*/
				/*手续费最低2元*/
				if(poundageNum > 2){
					$("#poundage font").text(poundageNum);
				}else{
					$("#poundage font").text("2");
				}
				/*判断是否选用提现券*/
				if($(".couponDirlogUl li").hasClass("checkli")){
					var zked = Number($(".couponDirlogUl li.checkli input").val());
					if(Number(zked) > Number(poundageNum)){
						$("#poundage font").text(Number(0));
		            }else{
		            	$("#poundage font").text(Number(poundageNum-zked).toFixed(2) );
		            }
				}
				withdrawNumFlag = true;
				
			}
		}else{
			if(accountBalance == parseFloat($(this).val())){
				$(this).siblings(".withdrawNum").removeClass("error").text("元");
				var cashYield = Number($("#cashYield").val());/*手续费利率*/
				var poundageNum = (Number($(this).val())*cashYield).toFixed(2);/*手续费*/
				/*手续费最低2元*/
				if(poundageNum > 2){
					$("#poundage font").text(poundageNum.toFixed(2));
				}else{
					$("#poundage font").text("2");
				}
				/*判断是否选用提现券*/
				if($(".couponDirlogUl li").hasClass("checkli")){
					var zked = Number($(".couponDirlogUl li.checkli input").val());
					if(Number(zked) > Number(poundageNum)){
						$("#poundage font").text(Number(0));
		            }else{
		            	$("#poundage font").text(Number(poundageNum-zked).toFixed(2) );
		            }
				}
				
				withdrawNumFlag = true;
			}else{
				$(this).val("").siblings(".withdrawNum").addClass("error").text("提现金额须为账户余额！");
			}	
		}
		
		/*else{
			withdrawNumFlag = true;
			$(this).siblings(".withdrawNum").removeClass("error").text("元");
		}*/
		
		
		//getWithdrawFee(account, userId);
		}
	});
	$("#withdrawSubmit").click(function(){
		
    		isDirlogShow ();
		
	     if($("#withdrawNum").val()=="" || $("#withdrawNum").val()==null){
	    	$("#withdrawNum").val("").siblings(".withdrawNum").addClass("error").text("提现金额不能为空！");
	    	return;
	     } 	
		 if(!withdrawNumFlag){
			$("#withdrawNum").val("").siblings(".withdrawNum").addClass("error").text("请输入正确的提现金额!");
			return false;
		 }
		 
		 $.ajax({
		       	url: $('#path').val() + "/cgTrade/withdraw", //提现
		       	type: "post",
		       	dataType: "json",
		       	data: {
		       		amount : $("#withdrawNum").val(),
		       		remark : '',
		       		memberCouponId: $(".couponDirlogUl li.checkli input").attr('id'),
		      		returnUrl : 'http://'+document.domain + window.location.pathname
		       	},
		       	success: function (data) {
		       		// result为1时，表示成功
		       		if (data.result == 1) {
		       			document.write(data.resultObject);
		       		} else {
		       			$('html,body').animate({scrollTop: '0px'}, 800);   
		       			$("#errorTxtBox p.txtp").html(data.errInfo);
		       			$("#errorTxtBox").show();
		       			$("body").css("overflow","hidden"); 
		       		}
		       	},
		       	error: function (data){
		       		$('html,body').animate({scrollTop: '0px'}, 800);   
	       			$("#errorTxtBox p.txtp").html(data.errInfo);
	       			$("#errorTxtBox").show();
	       			$("body").css("overflow","hidden"); 
		       	}
		   	});
	});
	txbox ();
	//提现弹出框
	function txbox (){
		var strbox = $(".couponDirlogUl");
		$.ajax({  
	        type: "post",  
	        dataType: "json",  
	        url: $('#path').val() + "/cgMem/coupon/list",
	        data: {  
	        	status:'1'
	        },  
	        success: function (response) {  
				var info = jQuery.parseJSON(response.result);
	        	if (info == 1) {
	        		var projects = response.resultObject.giftList == undefined ? response.resultObject
							: response.resultObject.giftList;
	        		var str="<li>不使用提现券<input name='coupon' type='checkbox' value='0' class='couponinput'></li>";
	        		if (projects.length > 0) {
	        			var arr = [];
	        			$.each(projects,function(index,domEle){
	        				 arr.push(domEle.amount);
	        			});
	        			var max=Number(arr[0]);
	        			for(var i=0;i<arr.length;i++){
	        				_data = projects[i];
        			       if(max<Number(arr[i])){
        			            max=Number(arr[i]);
        			        }
	        			};
		              	for (var i = 0; i < projects.length; i++) {
	           				 _data = projects[i];
         			       if(max == Number(_data.amount)){
         			             str += '<li class="checkli"><font>' + _data.amount + '元' +_data.giftName + '</font>';
     	            			str += "<span>" + _data.validity + "</span>" ; 
     	            			str += "<input id='"+ _data.couponId +"' name='coupon' type='checkbox' value='"+ _data.amount +"' checked class='couponinput'>"; 
     	            			str += "</li>";
         			        }else{
	            			
	            			str += '<li><font>' + _data.amount + '元' +_data.giftName + '</font>';
	            			str += "<span>" + _data.validity + "</span>" ; 
	            			str += "<input id='"+ _data.couponId +"' name='coupon' type='checkbox' value='"+ _data.amount +"' class='couponinput'>"; 
	            			str += "</li>";
         			        }
	                	}
		              	strbox.html(str);
		              	$(".couponBox font").text(Number($(".couponDirlogUl li.checkli input").val()) +'元提现券');
		              	$(".couponDirlogUl li").click(function (){
		              		if($("#withdrawNum").val() ==""){
		              			$("#couponerr").html('请输入提现金额。');
	                        	$("#couponerr").show(300).delay(2000).hide(300);
	                        	 setTimeout(function () {
	                        		 $(".couponYes").css("margin-top","20px");
	                        	 }, 2000);
		              		}else{
		              			var checkinp = $(this).find("input");
			            		$(this).addClass("checkli").siblings().removeClass("checkli");
			            		$(".couponDirlogUl li input").attr('checked',false);
			            		checkinp.attr('checked',true);
		              		}
		            	});
		              //提现弹出框确认按钮
		            	$(".couponYes").click(function (){
		            		var $this = $(this);
		            		var cashYield = Number($("#cashYield").val());/*手续费利率*/
		            		var poundage = (Number($("#withdrawNum").val())*cashYield).toFixed(2);
		            		if($(".couponDirlogUl li").hasClass("checkli")){
		                        var zked = (Number($(".couponDirlogUl li.checkli input").val())).toFixed(2);
		                        if(Number(zked) > Number(poundage)){
		                        	$("#poundage font").text(Number(0));
		                        	$("#couponDirlog").hide();
		                        }else{
		                        	$("#poundage font").text(Number(poundage-zked).toFixed(2) );
		                        	$("#couponDirlog").hide();
		                        }
		                        $(".couponBox font").text(Number($(".couponDirlogUl li.checkli input").val()) +'元提现券');
		                    }else{
		                    	$("#couponDirlog").hide();
		                    }
		            		
		            	})
	       			} else {
	       				strbox.html("<p style='text-align:center;font-size: 20px;line-height: 150px;'>暂无提现券可用</p>") ;
	       				//提现弹出框关闭
		            	$(".couponYes").click(function (){
		            		$("#couponDirlog").hide();
		            	})
	            	}
	        	}else{
	        		strbox.html("<p style='text-align:center;font-size: 20px;line-height: 150px;'>暂无提现券可用</p>") ;
	        		//提现弹出框关闭
	            	$(".couponYes").click(function (){
	            		$("#couponDirlog").hide();
	            	})
	        	}
	        },  
	        error: function (data) {  
	        	strbox.html("<p style='text-align:center;font-size: 20px;line-height: 150px;'>暂无提现券可用</p>") ;
	        	//提现弹出框关闭
            	$(".couponYes").click(function (){
            		$("#couponDirlog").hide();
            	})
	        }  
	    });
	}
	//提现券弹出框
	$(".couponBox font").click(function (){
		$("#couponDirlog").show();
	})
	//提现券
	$(".closecouponBtn").click(function (){
		$("#couponDirlog").hide();
	})
	
	//充值金额
	var rechargeNumFlag;
	$("#rechargeNum").keyup(function(){
		rechargeNumFlag = false;
		var pattern = /^(([1-9]\d{0,9})|0)(\.\d{1,2})?$/;
		var account = parseFloat($(this).val());
		if($(this).val() == "" || $(this).val() == undefined){
			return;
		}else if(!validateNumberic($(this)) || !account > 0 || !pattern.test(account)){
			$("#rechargeAutualNum").html("0");
			$(this).val("").siblings(".rechargeNum").addClass("error").text("充值金额必须合法");
			return;
		}else{
			rechargeNumFlag = true;
			$(this).siblings(".rechargeNum").removeClass("error").text("元");
		}
		//getRechargeForGopayFee(account);
		
	});
	
	$("#rechargeNum").blur(function(){
		rechargeNumFlag = false;
		var account = parseFloat($(this).val());
		if(!validateNumberic($(this)) || !account > 0 || account < 100){
			
			$(this).val("").siblings(".rechargeNum").addClass("error").text("充值金额必须大于等于100元");
			return;
		}else{
			rechargeNumFlag = true;
			$(this).siblings(".rechargeNum").removeClass("error").text("元");
		}
		//getRechargeForGopayFee(account);
		
	});
	$("#rechargeSubmit").click(function(){
		var balance = $("#balanceinput").val();
		var numbalance = parseFloat( balance.split(",").join("") );
		if(Number(numbalance)>0){
			$("#balanceBox").show();
		}else{
		isDirlogShow ();
		if(!rechargeNumFlag){
			$("#rechargeNum").val("").siblings(".rechargeNum").addClass("error").html("请填写有效金额");
			return false;
		}else{
			$.ajax({
		       	url: $('#path').val() + "/cgTrade/recharge", // 充值
		       	type: "post",
		       	dataType: "json",
		       	data: {
		       		amount : $("#rechargeNum").val(),
		       		remark : '',
		      		returnUrl : 'http://'+document.domain + window.location.pathname
		       	},
		       	success: function (data) {
		       		// result为1时，表示成功
		       		if (data.result == 1) {
		       			document.write(data.resultObject);
		       		} else {
		       			$('html,body').animate({scrollTop: '0px'}, 800);   
		       			$("#errorTxtBox p.txtp").html(data.errInfo);
		       			$("#errorTxtBox").show();
		       			$("body").css("overflow","hidden"); 
		       		}
		       	},
		       	error: function (data){
		       		$('html,body').animate({scrollTop: '0px'}, 800);   
	       			$("#errorTxtBox p.txtp").html(data.errInfo);
	       			$("#errorTxtBox").show();
	       			$("body").css("overflow","hidden");
		       	}
		   	});
		  }
		}
	});
	//获取充值手续费
	function getRechargeForGopayFee(recharge,submit){
		$.get("get-recharge-for-gopay-fee","rechargeNum="+recharge,function(data){
			if(!typeof(data) != "object")
				data = JSON.parse(data);
				$("#rechargeFee").text(data.rechargeFee);
				var rechargeAutualNum = parseFloat(recharge) - parseFloat(data.rechargeFee);
				$("#rechargeAutualNum").html(rechargeAutualNum);
				
		});
	};
	//点击 立即充值 按钮后出现遮罩
	function rechargePendingPage(){
		/*设置遮罩层的高度*/
		var documentHeight=$(document).height();
		$(".zhezhao").height(documentHeight);	  
		$(".zhezhao").css("display","block").animate({"opacity":"0.3"},500,function(){
			$(".frame").show().animate({"opacity":"1"},500)
		})
		return false;
	}
	
})
//获取提现手续费
function getWithdrawFee(withdrawNum ,userId){
	$.get("get-withdraw-fee","withdrawNum="+withdrawNum+"&userId="+userId,function(data){
		if(!typeof(data) != "object")
			data = JSON.parse(data);
			$("#totalFee").text(data.totalFee);
			$("#withdrawFee").text(data.withdrawFee);
			$("#extraFee").text(data.extraFee);
			
	});
};

function validateNumberic(obj){
	if(!obj.val())
		return false;
	if(isNaN(obj.val())|| !(parseFloat(obj.val())>=0)){
		obj.val("").focus();
		return false;
	}
	obj.siblings(".errorClass").text("");
	return true;
}

/*//点击 立即充值 按钮后出现遮罩
function rechargePendingPage(){
	设置遮罩层的高度
	var documentHeight=$(document).height();
	$(".zhezhao").height(documentHeight);	  
	$(".zhezhao").css("display","block").animate({"opacity":"0.3"},500,function(){
		$(".frame").show().animate({"opacity":"1"},500)
	})
	return false;
}*/

/*关闭弹窗*/
function closeWindow(){
	$(".frame").animate({"opacity":"0"},500,function(){
		$(this).hide();
		$(this).prev().animate({"opacity":"0"},500,function(){$(this).hide();})
	})

}