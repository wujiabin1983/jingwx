<!--扫码领券-->
<template lang="html">
	<box class="app noBottom">
		<!-- <x-header :left-options="{backText: ''}">set empty back text</x-header> -->
		<div class="receive-coupon" v-if="isWechat" :style="bgStyle">
			<!--<p class="title">&nbsp;</p>-->
			<dsh-voucher v-if="isVoucherShow" class="voucher" v-for="item in itemsVoucher" :key="item.coupId" :tabType="item.status" :price="item.couponValue" :type="item.coupType" :info="item.coupName" :subInfo="item.useThreshold" :time="item.coupDate" :isBtn="item.isBtn" :bgColor="item.bgColor">
			</dsh-voucher>
			<!--<div class="attention" v-if="isAttention">
				<img :src="twoQcard" />
				<p>领取成功，关注公众号查看并使用</p>
			</div>-->
			<dsh-button class="btn" type="primary" v-if="isShowBtn"  :disabled="btnDisabled" :size="490" :text="buttonStr" @click.native="handleAttentionPublic"></dsh-button>
			<div class="qcUrl" v-if="isVoucherShow">
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
	import twoQcard from '@/assets/imgExchange1.png'
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
				show2: false,
				showToast: false,
				timeToast: 3000,
				toastText: '',
				warning:warning,
				isAttention: false,
				twoQcard: twoQcard,
				isFlag1: '', //是否已关注微信公众号
				token: '',
				btnDisabled: true,
				isShowBtn: false,
				isVoucherShow: true,
				buttonStr: '',
				type: '',
				id: '',
				itemsVoucher: [],
				qrUrl:'',
				publicName:'',
			}
		},
		methods: {
			handleAttentionPublic() {
				if(this.btnDisabled){
					return false;
				}else{
					let params = {
						"openId": this.token,
						"type": this.type, // (0:线下门店扫一扫/1：面对面扫码)
						"id": this.id
					}
					this.show2 = true;
					this.$http.post('I_SCRM_WX_INTERFACE_017.action', params).then((res) => {
						let data = res.data,
							code = data.returnCode,
							msg = data.returnMsg;
						if(code == '0') {
							this.toastText = msg;
							this.showToast = true;
							this.show2 = false;
							if(this.isFlag1 == "否") {
								this.isAttention = true;
								this.isShowBtn = false;
							} else {
								localStorage.setItem("token", this.token);
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
				// let url = 'http://dsh.nat200.top/scrmwxweb/#/ActivePhone?openId=153009308784600069&reqOpenId=oHJ6q06AWJ3zLjoPuEU9vmPLqUdM&activityId=null'
				let theRequest = {}
				if(url.indexOf('?') >= 0) {
					let strArr = url.split('?')[1].split('&')
					// console.log(strArr, 'aaaa');
					strArr.forEach(val => {
						let str = val.split('=')
						// console.log(str, 'ddddddd')
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
//						let msg={"id":"153173583014700015","buttonDesc":"","coupInfo":[{"coupName":"礼品券","couponValue":"","coupType":"礼品券","coupDate":"2018-07-18~2018-07-30","bgColor":"#00FF62","useDesc":""}],"isFlag1":"是","isFlag2":"是"};
//						let msg={"id":"153198015179300006","buttonDesc":"","coupInfo":[{"coupName":"100-10券","couponValue":"10","coupType":"礼品券","coupDate":"2018-07-18~2018-07-30","bgColor":"#00FF62","useDesc":""}],"isFlag1":"是","isFlag2":"是"};
//						that.buttonStr = msg.buttonDesc==""?'立即领取':msg.buttonDesc;
//						that.itemsVoucher = [];
//						msg.coupInfo.forEach((val, index) => {
//					        that. .push({
//					        	"index":index,
//								"status": '可使用',
//								"coupName": val.coupName,
//						    	"coupDate":val.coupDate,
//								"coupType": val.coupType,
//								"couponValue": val.couponValue,
//					  			"useDesc": val.useDesc,
//						    	"bgColor":val.bgColor,
//						    	"isBtn":false
//					        });
//						});
//						if(msg.buttonDesc==""){
//							this.btnDisabled=false
//						}else{
//							this.btnDisabled=true;
//						}
//						that.isFlag1=msg.isFlag1;
			let getRequest = this.GetRequest();
			if(getRequest.openId) {
				this.token = getRequest.openId;
				localStorage.setItem("token", this.token);
				let openId = getRequest.openId,
					type = getRequest.type,
					id = getRequest.id,
					storeId = getRequest.storeId;
				this.type = getRequest.type;
				this.id = getRequest.id;
				let params = {
					"openId": openId,
					"type": type, // (0:线下门店扫一扫/1：面对面扫码)
					"id": id
				}
				this.$http.post('I_SCRM_WX_INTERFACE_040.action', params).then((res) => {
					let data = res.data,
						code = data.returnCode,
						msg = data.returnMsg;
					if(code == '0') {
						that.buttonStr = msg.buttonDesc == "" ? '立即领取' : msg.buttonDesc;
						that.itemsVoucher = [];
						msg.coupInfo.forEach((val, index) => {
							that.itemsVoucher.push({
								"index": index,
								"status": '可使用',
								"coupName": val.coupName,
								"coupDate": val.coupDate,
								"coupType": val.coupType,
								"couponValue": val.couponValue,
								"useThreshold": val.useThreshold,
								"bgColor": val.bgColor,
								"isBtn": false
							});
						});
						that.qrUrl=msg.qrUrl;
						that.publicName=msg.publicName;
						that.isFlag1 = msg.isFlag1;

						if(that.isFlag1 == "否") {
							that.isShowBtn = false;
						}else{
							that.isShowBtn = true;
						}
						if(msg.buttonDesc == "") {
							that.btnDisabled = false
						} else {
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
			padding: 36*@rem 0 30*@rem;
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
			margin-top: 30*@rem;
			margin-bottom: 10*@rem;
			height: auto;
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
	.attention {
		img {
			width: 290*@rem;
			height: 290*@rem;
		}
		p {
			font-size: 32*@rem;
			color: #373737;
			margin-top: 58*@rem;
		}
	}
	.noBottom{
		padding: 0;
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
			margin: 30*@rem auto;
		}
	}
</style>