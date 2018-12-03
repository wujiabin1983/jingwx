<!--领券优惠券 - 赠送-->
<template lang="html">
	<box class="app noBottom">
		<!-- <x-header :left-options="{backText: ''}">set empty back text</x-header> -->
		<div class="receive-coupon" v-if="isWechat" :style="bgStyle">
			<p class="title">{{titleInfo}}</p>
			<dsh-voucher class="voucher" v-for="item in itemsVoucher" :key="item.coupId" :tabType="item.status" :price="item.couponValue" :type="item.coupType" :info="item.coupName" :subInfo="item.useThreshold" :time="item.coupDate" :isBtn="item.isBtn" :bgColor="item.bgColor">
			</dsh-voucher>
			<!--<div class="attention" v-if="isAttention">
				<img :src="twoQcard" />
				<p>领取成功，关注公众号查看并使用</p>
			</div>-->
			<dsh-button class="btn" type="primary" :disabled="btnDisabled" v-if="isShowBtn&&btnType!=''" :size="490" :text="btnType" @click.native="handleAttentionPublic"></dsh-button>
			<div class="qcUrl" v-if="isAttention">
				<p>打开微信查找公众号<b>{{publicName}}</b></p>
				<p>或</p>
				<p>截屏或长按将二维码保存到手机相册，使用微信<b>"扫一扫"</b>，<b>"相册"</b>关注公众号 </p>
				<img :src="qrUrl"/>
			</div>
		</div>
		<div class="noWechat" v-else>
			<img :src="warning"/>
			<p>请在微信客户端打开连接</p>
		</div>
		<toast v-model="showToast" :time="timeToast" :is-show-mask="true" type="success" width="8rem">{{toastText}}</toast>
		<loading :show="show2" text=""></loading>
	</box>
</template>

<script>
	import { Box, Loading, Toast } from 'vux'
	const DshButton = () =>
		import('@/components/DshButton/DshButton.vue').then(m => m.default)
	const DshVoucher = () =>
		import('@/components/DshVoucher/DshVoucher.vue').then(m => m.default)
	// const DshBr = () => import('@/components/DshBr/DshBr.vue').then(m => m.default)
	import more from '@/assets/more.png'
	import warning from '@/assets/warning2.png'
	import background from '@/assets/background1.png'
	export default {
		name: '优惠券',
		components: {
			Box,
			DshButton,
			DshVoucher,
			Loading,
			Toast
		},
		data() {
			return {
				bgStyle:{
					backgroundImage:'url('+background+')' 
				},
				isWechat:false,
				btnDisabled: false,
				isShowBtn: false,
				isAttention: false,
				titleInfo: '',
				show2: true,
				warning:warning,
				twoQcard: '',
				btnType: '立即领取',
				showToast: false,
				timeToast: 3000,
				toastText: '',
				token: '',
				type: '',
				id: '',
				isFlag1: '',
				itemsVoucher: [],
				qrUrl:'',
				publicName:'',
			}
		},
		methods: {
			handleAttentionPublic() {
				if(this.btnType == "已领取") {
					this.$router.replace({
						name: '我的券'
					});
					return false;
				}
				if(this.btnDisabled){
					return false;
				}else{
					this.show2 = true;
					let params = {
						"openId": this.token,
						"type": this.type,
						"id": this.id // id关联ID
					}
					this.$http.post('I_SCRM_WX_INTERFACE_017.action', params).then((res) => {
						let data = res.data,
							code = data.returnCode,
							msg = data.returnMsg;
						if(code == '0') {
							this.toastText = msg;
							this.showToast = true;
							this.show2 = false;
							if(this.isFlag1 == "否") {
								this.isShowBtn = false;
							} else {
								setTimeout(() => {
									this.$router.replace({
										name: '我的券'
									});
								}, 3000)
							}
						}else{
							this.show2 = false;
							this.toastText = msg;
							this.showToast = true;
						}
					});
				}
			},
			// 获取 openId及参数
			GetRequest() {
				let url = window.location.href // 获取url中"?"符后的字串
				let theRequest = {}
				if(url.indexOf('?') >= 0) {
					let strArr = url.split('?')[1].split('&')
					strArr.forEach(val => {
						let str = val.split('=')
						theRequest[str[0]] = str[1]
					})
				}
				return theRequest
			}
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
				//或者return false;
				e.preventDefault();
			};
			let that = this;
//						let msg={"bgColor":"#00FF62","coupCode":"D00000000002","coupId":"CN2018070900001","userName":"钱浩鑫","coupType":"礼品券","couponValue":0,"qcUrl":"http://dsh.nat200.top:80/scrmwx/barcode/Pj000001青岛啤酒.JPEG","isFlag1":"是","useThreshold":"消费满1000元可用"};
//						that.itemsVoucher = [];
//						that.itemsVoucher.push({
//							"index": 0,
//							"status": '可使用',
//							"coupName": msg.coupName,
//							"coupDate": msg.coupDate,
//							"coupType": msg.coupType,
//							"couponValue": msg.couponValue,
//							"useThreshold": msg.useThreshold,
//							"bgColor": msg.bgColor,
//							"isBtn": false
//						});
//						that.userName=msg.userName;
			let getRequest = this.GetRequest();
			if(getRequest.openId) {
				this.token = getRequest.openId;
				localStorage.setItem("token", this.token);
				let openId = getRequest.openId,
					type = getRequest.type,
					id = getRequest.id;
				this.type = getRequest.type;
				this.id = getRequest.id;
//				this.$http.post('getSignInfo.action', {
//					openId: this.token,
//					url: encodeURIComponent(window.location.href.split('#')[0])
//				}).then((res) => {
//					let data = res.data,
//						code = data.returnCode,
//						msg = data.returnMsg,
//						that = this;
//					if(code == '0') {
//						this.show2 = false;
//						wx.config({
//							debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
//							appId: msg.appId, // 必填，公众号的唯一标识
//							timestamp: msg.timestamp, // 必填，生成签名的时间戳
//							nonceStr: msg.nonceStr, // 必填，生成签名的随机串
//							signature: msg.signature, // 必填，签名，见附录1
//							jsApiList: ['hideMenuItems']
//							// 必填，需要使用的JS接口列表，所有JS接口列表见附录2
//						});
//						wx.ready(function() {
//							wx.hideMenuItems({
//								menuList: ["menuItem:share:timeline", //分享到朋友圈
//									"menuItem:share:appMessage", //发送给朋友
//									"menuItem:share:qq", //分享到QQ
//									"menuItem:share:weiboApp", //分享到Weibo
//									"menuItem:favorite", //收藏
//									"menuItem:share:facebook", //分享到FB
//									"menuItem:share:QZone", //分享到 QQ 空间
//									"menuItem:editTag", //编辑标签
//									"menuItem:delete", //删除
//									"menuItem:copyUrl", //复制链接
//									"menuItem:originPage", //原网页
//									"menuItem:readMode", //阅读模式
//									"menuItem:openWithQQBrowser", //在QQ浏览器中打开
//									"menuItem:openWithSafari", //在Safari中打开
//									"menuItem:share:email", //邮件
//									"menuItem:share:brand"
//								] //一些特殊公众号
//								// 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮
//							})
//						})
//					}
//				});
				let params = {
					"openId": openId,
					"coupCode": id // id关联ID
				}
				this.$http.post('I_SCRM_WX_INTERFACE_016.action', params).then((res) => {
					let data = res.data,
						code = data.returnCode,
						msg = data.returnMsg;
					if(code == '0') {
						that.itemsVoucher = [];
						that.itemsVoucher.push({
							"index": 0,
							"status": '可使用',
							"coupName": msg.coupName,
							"coupDate": msg.coupDate,
							"coupType": msg.coupType,
							"couponValue": msg.couponValue,
							"useThreshold": msg.useThreshold,
							"bgColor": msg.bgColor,
							"isBtn": false
						});
						that.qrUrl=msg.qrUrl;
						that.publicName=msg.publicName;
						that.isAttention = true;
						if(that.isFlag1 == "否") {
							that.isShowBtn = false;
						}else{
							that.isShowBtn = true;
						}
						that.titleInfo = msg.userName + '分享给您一张优惠券';
						that.isFlag1 = msg.isFlag1;
						that.btnType = msg.buttonDesc;
						if(that.btnType == "") {
							that.titleInfo = "您分享的一张优惠券";
						}
						if(that.btnType == "已领取") {
							that.btnDisabled = true;
						}
						that.show2 = false;
					}else{
						that.show2 = false;
						that.toastText = msg;
						that.showToast = true;
					}
				});

			} else if(localStorage.getItem("token")) {
				this.token = localStorage.getItem("token");
			}

		}
	}
</script>

<style lang="less">
	.receive-coupon {
		text-align: center;
		background-size: 100%;
		overflow: hidden;
		background-repeat: no-repeat;
		height: 100%;
		padding-top: 60*@rem;
		box-sizing: border-box;
		.title {
			padding: 26*@rem 0 10*@rem;
			font-size: 36*@rem;
			color: #373737;
		}
		.voucher {
			.dsh-voucher {
				margin: 20*@rem auto;
				width: 90%;
				margin: 0 auto;
			}
		}
		.btn {
			margin-top: 20*@rem;
			margin-bottom: 10*@rem;
			height: auto;
		}
	}
	.qcUrl{
		width:90%;
		background: #fff;
		margin: 0 auto;
		margin-top: 30*@rem;
		border-radius: 10*@rem;
		padding: 30*@rem 40*@rem;
		box-sizing: border-box;
		p{
			color: #C9C9C9;
			b{
				color: #333
			}
		}
		img{
			width: 300*@rem;
			height: 300*@rem;
			display: block;
			margin: 0*@rem auto;
			margin-top: 10*@rem;
		}
	}
	.noBottom{
		padding: 0;
	}
</style>