<!--券详情-->
<template lang="html">
	<box class="app">
		<div class="app-container voucher-details-wrap" v-bind:style="{'background-color':ColorVal}" v-if="isWechat">
			<div class="logo-box">
				<img :src="voucherData.brandLogo" alt="">
			</div>
			<div class="voucher-details-box">
				<div class="basics-info">
					<p class="name">{{voucherData.coupName}}</p>
					<p class="time">有效期:{{voucherData.coupDate}}</p>
					<div class="barcode">
						<img :src="voucherData.bcUrl" alt="">
					</div>
					<p  class="code-num">{{voucherData.coupNum}}</p>
					<div class="qr-code" v-if="isQrcode">
						<img :src="voucherData.qcUrl">
					</div>
					<p class="desc">到店出示卡卷</p>
				</div>
				<div class="tip">
					<div class="d1" v-bind:style="{'background-color':ColorVal}" ></div>{{voucherData.useDesc}}<div class="d2" v-bind:style="{'background-color':ColorVal}"></div>
				</div>
				<div class="application-store-btn" @click="handleApplicationStore">
					适用门店
					<div class="arrows"></div>
				</div>
			</div>
			<div class="give-btn" @click="handleReceiveCoupon" v-if="voucherData.isGive">
				赠送
			</div>
		</div>
		<div class="noWechat" v-else>
			<img :src="warning"/>
			<p>请在微信客户端打开连接</p>
		</div>
		<loading :show="showLoading" text=""></loading>
		<toast v-model="showToast" :time="timeToast" :is-show-mask="true" :type="typeToast" width="8rem">{{toastText}}</toast>
		<div v-if="isShowTranspondTip" class="transpond_tip-box" @click="isShowTranspondTip=false">
			<img src="@/assets/coupon/transpond_tip.png" alt="">
		</div>
	</box>
</template>

<script>
	import home from '@/assets/home.png'
	import { Box, Group, Cell, Loading, Toast } from 'vux'
	const DshButton = () =>
		import('@/components/DshButton/DshButton.vue').then(m => m.default)
	const DshBr = () =>
		import('@/components/DshBr/DshBr.vue').then(m => m.default)
	import MyVoucherDetailsQrcode1 from '@/assets/MyVoucherDetailsQrcode1.png'
	import MyVoucherDetailsQrcode2 from '@/assets/201809121518510188.png'
	import loadingLost from '@/assets/loadingLost.png'
	import warning from '@/assets/warning2.png'
	export default {
		name: '券详情',
		components: {
			Box,
			DshBr,
			Group,
			Cell,
			Loading,
			Toast
		},
		data() {
			return {
				isShowTranspondTip:false,
				isQrcode:false,
				warning:warning,
				home: home, //跳转首页按钮
				timeToast: 3000, //提示窗显示时间
				typeToast: 'text', //提示窗内容类型
				toastText: '', //提示窗内容
				showToast: false, //toast
				showLoading: true, //loading
				token: '',
				isWechat:false,
				img: {
					MyVoucherDetailsQrcode1: MyVoucherDetailsQrcode1,
					MyVoucherDetailsQrcode2: MyVoucherDetailsQrcode2
				},
				loadingLost:loadingLost,
				voucherData: {
					"coupName": "", // 优惠券名称
					"coupDate": "", // 优惠券有效期
					"coupNum": "", // 优惠券号
					"useDesc": "", // 使用说明
					"qcUrl": '' // 二维码图片
				},
				dataMsg: {}, //分享配置参数
				ColorVal: "#F8F8F8" //明细页背景色
			}
		},
		methods: {
			handleBackHome() {
				this.$router.push({
					name: '会员中心首页'
				});
			},
			// 适用门店
			handleApplicationStore() {
				// console.log(this.voucherData);return false;
				this.$router.push({
					name: '适用门店',
					params: {
						data: JSON.stringify(this.voucherData)
					}
				});
			},
			handleReceiveCoupon() {
				this.showLoading = true;
				//				console.log(JSON.stringify(this.dataMsg))
				this.$http.post('getSignInfo.action', {
					openId: this.token,
					url: encodeURIComponent(window.location.href.split('#')[0])
				}).then((res) => {
					let data = res.data,
						code = data.returnCode,
						msg = data.returnMsg,
						that = this;
					if(code == '0') {
						this.showLoading = false;
						// this.toastText = "请点击右上角分享给好友";
						// this.typeToast = "text";
						// this.showToast = true;
						// this.timeToast = 3000;
						this.isShowTranspondTip = true;
						wx.config({
							debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
							appId: msg.appId, // 必填，公众号的唯一标识
							timestamp: msg.timestamp, // 必填，生成签名的时间戳
							nonceStr: msg.nonceStr, // 必填，生成签名的随机串
							signature: msg.signature, // 必填，签名，见附录1
							jsApiList: ['onMenuShareAppMessage']
							// 必填，需要使用的JS接口列表，所有JS接口列表见附录2
						});
						wx.ready(function() {
							let urlAddr = window.location.href.split("#")[0] + "Page.html?params=" + that.dataMsg.link;
							// 用户点击了分享后执行的回调函数
							wx.onMenuShareAppMessage({
								title: that.dataMsg.title, // 分享标题
								desc: that.dataMsg.desc, // 分享描述
								link: urlAddr, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
								imgUrl: that.dataMsg.imgurl, // 分享图标
								type: '', // 分享类型,music、video或link，不填默认为link
								dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
								success: function() {}
							});
						})
						
					}
				});
			},
		},
		computed: {

		},
		created() {
			var ua = window.navigator.userAgent.toLowerCase();
		    if(ua.match(/MicroMessenger/i) != 'micromessenger'){
		    	this.isWechat=false;
				this.showLoading = false;
		        return false;
		    }else{
				this.isWechat=true;
		    }
			document.oncontextmenu = function(e) {
				e.preventDefault();
			};
			if(window.location.href.split('=')[1]) {
				this.token = window.location.href.split('=')[1];
				localStorage.setItem("token", this.token);
			} else if(localStorage.getItem("token")) {
				this.token = localStorage.getItem("token");
			}
			let { activityId, coupId} = this.$route.params
			let params = {
				openId: this.token,
				activityId, // 关联ID
				coupId// 优惠券ID
			}
			this.$http.post('I_SCRM_WX_INTERFACE_014.action', params).then((res) => {
				let data = res.data,
					code = data.returnCode,
					msg = data.returnMsg;
				console.log(JSON.stringify(data) + '014')
				let that = this;
				that.showLoading = false;
				that.ColorVal = msg.bgColor.end;
				if(code == '0') {
					if(JSON.stringify(msg)=="{}"){
						msg.qcUrl = that.loadingLost;
					}
					if(msg.qcUrl==''){
						msg.qcUrl = that.loadingLost;
					}
					that.isQrcode=true;
					that.voucherData = msg;
					that.$http.post('I_SCRM_WX_INTERFACE_056.action', {
						openId: that.token,
						coupCode: msg.coupNum
					}).then((resInv) => {
						if(resInv.data.returnCode == '0') {
							that.dataMsg = resInv.data.returnMsg;
						}
					});
				}else{
					that.qcUrl = that.loadingLost;
				}
			});
		}
	}
</script>
<style lang="less" scoped>
img{
	width:100%;
}
.transpond_tip-box{
	width:750*@rem;
	position: fixed;
	top:0;
	left:0;
}
.voucher-details-wrap{
	color:#111;
	font-size: 30*@rem;
	padding:50*@rem 30*@rem;
	--background-color:#f8576c;
	position: relative;
	.logo-box{
		position: absolute;
		top:20*@rem;
		left:50%;
		transform: translateX(-50%);
		width:100*@rem;
		height:100*@rem;
		border-radius: 50%;
		background-color: #fff;
		box-shadow: 0 0 20*@rem rgba(0,0,0,0.2);
		padding:15*@rem;
		img{
			width: 100%;
			border-radius: 50%;
			margin: 0 auto;
		}
	}
	.voucher-details-box{
		border-radius: 10*@rem;
		background-color: #fff;
		padding:30*@rem;
		padding-bottom: 0;
		.basics-info{
			padding-top:100*@rem;
			padding-bottom:30*@rem;
			text-align: center;
			.name{
				font-size: 40*@rem;
			}
			.time{
				color:#aaa;
				font-size: 24*@rem;
			}
			.qr-code{
				width:340*@rem;
				// margin: 22*@rem auto;
				margin: 0 auto;
			}
			.desc{
				color: #666;
			}
		}
		.tip{
			border-top:1px dotted #dfdfdf;
			padding:30*@rem 0;
			position: relative;
			.d1,.d2{
				content: '';
				display: inline-block;
				width: 46*@rem;
				height: 46*@rem;
				border-radius: 50%;
				--background-color: #f8576c;
				position: absolute;
				top:-25*@rem;
			}
			.d1{
				left:-55*@rem;
			}
			.d2{
				right:-55*@rem;
			}
			
		}
		.application-store-btn{
			padding:30*@rem 0;
			position: relative;
			border-top:1px solid #dfdfdf;
			.arrows{
				padding-right: 10*@rem;
				position: absolute;
				right:0;
				width:10*@rem;
				height:10*@rem;
				top:50%;
				transform: translateY(-50%);
				// line-height: 0.88rem;
				// height: 0.88rem;
				color: #999999;
				&::after{
					content: " ";
					display: inline-block;
					height: 6px;
					width: 6px;
					border-width: 2px 2px 0 0;
					border-color: #949494;
					border-style: solid;
					-webkit-transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
					transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
					position: relative;
					top: -2px;
					position: absolute;
					top: 50%;
					margin-top: -4px;
					right: 2px;
				}
			}
		}
	}
	.give-btn{
		height: 90*@rem;
		line-height:  90*@rem;
		text-align: center;
		background-color:#fff;
		border-radius: 10*@rem;
		margin:14*@rem 0;

	}
}
.noWechat{
	width: 100%;
	padding-top: 80*@rem;
	img{
		width: 40%;
		margin: 0 auto;
		display: block;
	}
	p{
		text-align: center;
		font-size: 40*@rem;
		margin-top: 30*@rem;
	}
}

</style>