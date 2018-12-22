<!--券详情-->
<template lang="html">
	<box class="app">
		<div class="app-container" v-if="isWechat">
			<div class="info-voucher-detail">
				<div class="name">{{voucherData.coupName}}</div>
				<div class="time">有效期: {{voucherData.coupDate}}</div>
				<div class="qrcode" v-if="isQrcode">
					<img :src="voucherData.qcUrl">
				</div>
				<div class="code">{{voucherData.coupNum}}</div>
				<div class="explain">到店出示卡券</div>
			</div>
			<dsh-br></dsh-br>
			<div class="instruction">
				<div class="title">使用说明:</div>
				<div class="instruction-info">
					<p>{{voucherData.useDesc}}</p>
				</div>
			</div>
			<dsh-br></dsh-br>
			<group class="dsh-group-no-border">
				<cell class="dsh-cell" title="适用门店" is-link @click.native="handleApplicationStore"></cell>
				<dsh-br></dsh-br>
				<cell class="dsh-cell" title="赠送" is-link @click.native="handleReceiveCoupon" v-if="giveFlag"></cell>
			</group>
			<!--<img id="icon-home" :src="home" alt="" v-if="$route.path != '/'" @click="handleBackHome">-->
		</div>
		<div class="noWechat" v-else>
			<img :src="warning"/>
			<p>请在微信客户端打开连接</p>
		</div>
		<loading :show="show2" text=""></loading>
		<toast v-model="showToast" :time="timeToast" :is-show-mask="true" :type="typeToast" width="8rem">{{toastText}}</toast>
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
				isQrcode:false,
				warning:warning,
				home: home, //跳转首页按钮
				timeToast: 3000, //提示窗显示时间
				typeToast: 'text', //提示窗内容类型
				toastText: '', //提示窗内容
				showToast: false, //toast
				show2: true, //loading
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
				giveFlag: false //赠送按钮显隐
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
				this.show2 = true;
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
						this.show2 = false;
						this.toastText = "请点击右上角分享给好友";
						this.typeToast = "text";
						this.showToast = true;
						this.timeToast = 3000;
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
				this.show2 = false;
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
			let params = {
				openId: this.token,
				"activityId": localStorage.getItem('myVoucheActivityId'), // 关联ID
				"coupId": localStorage.getItem('myVoucheCoupId') // 优惠券ID
			}
			this.$http.post('I_SCRM_WX_INTERFACE_014.action', params).then((res) => {
				let data = res.data,
					code = data.returnCode,
					msg = data.returnMsg;
				console.log(JSON.stringify(data) + '014')
				let that = this;
				that.show2 = false;
				if(code == '0') {
					if(JSON.stringify(msg)=="{}"){
						msg.qcUrl = that.loadingLost;
					}
					if(msg.qcUrl==''){
						msg.qcUrl = that.loadingLost;
					}
					that.isQrcode=true;
					that.voucherData = msg;
					that.giveFlag = that.voucherData.isGive;
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

<style lang="less">
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
	.info-voucher-detail {
		text-align: center;
		background: #FFF;
		.name {
			height: 36*@rem;
			line-height: 36*@rem;
			font-size: 36*@rem;
			color: #3b3b3b;
			padding-top: 40*@rem;
		}
		.time {
			height: 22*@rem;
			line-height: 22*@rem;
			font-size: 22*@rem;
			color: #9d9d9d;
			padding-top: 20*@rem;
		}
		// 二维码
		.qrcode {
			width: 220*@rem;
			height: 220*@rem;
			margin: 28*@rem auto 0;
			overflow: hidden;
			img {
				width: 220*@rem;
				height: 220*@rem;
				display: block;
			}
		}
		// 卡号
		.code {
			height: 17*@rem;
			line-height: 17*@rem;
			font-size: 22*@rem;
			color: #3b3b3b;
			padding-top: 26*@rem;
		}
		// 条形码
		.arcode-1 {
			width: 239*@rem;
			height: 106*@rem;
			background: #CCC;
			margin: 32*@rem auto 0;
			img {
				width: 239*@rem;
				height: 106*@rem;
			}
		}
		.explain {
			height: 24*@rem;
			line-height: 24*@rem;
			font-size: 24*@rem;
			color: #3b3b3b;
			padding: 22*@rem 0 26*@rem;
		}
	}
	
	.instruction {
		display: flex;
		justify-content: flex-start;
		padding: 38*@rem 0 38*@rem 50*@rem;
		background: #FFF;
		.title {
			float: left;
			width: 120*@rem;
			font-size: 24*@rem;
			color: #3b3b3b;
		}
	}
</style>