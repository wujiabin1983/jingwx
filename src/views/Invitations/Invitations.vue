<!--会员邀请-->
<template lang="html">
	<box class="app dsh-box">
		<!-- <x-header :left-options="{backText: ''}">set empty back text</x-header> -->
		<div class="app-container" v-if="isWechat">
			<view-box>
				<div class="dsh-group"></div>
				<div class="img-box-invitation" v-html="invitationInfo"></div>
				<div class="btn-invitation">
					<dsh-button v-if="!invitation" id="invitationClick" text="邀请好友" type="primary" size="284" @click.native="handleInviteInfo"></dsh-button>
					<dsh-button v-if="!invitation" text="查看邀请记录" type="primary" size="284" @click.native="handleViewRecord"></dsh-button>
					<dsh-button v-if="invitation" text="入会领卡" type="primary" size="490" @click.native="handleGet"></dsh-button>
				</div>
			</view-box>
		</div>
		<div class="noWechat" v-else>
			<img :src="warning"/>
			<p>请在微信客户端打开连接</p>
		</div>
		<loading :show="show2" text=""></loading>
		<toast v-model="showToast" :is-show-mask="true" :type="typeToast" width="8rem">{{toastText}}</toast>
	</box>
</template>

<script>
	import { Box, Group, ViewBox, Toast, Loading } from 'vux'
	const DshButton = () =>
		import('@/components/DshButton/DshButton.vue').then(m => m.default)
	import warning from '@/assets/warning2.png'
	export default {
		name: '会员邀请',
		components: {
			Box,
			Group,
			DshButton,
			ViewBox,
			Toast,
			Loading
		},
		data() {
			return {
				warning:warning,
				isWechat:false,
				token:'',
				reqOpenId: '',
				activityId: '',
				timeToast: 1000,
				show2: false,
				typeToast: 'text',
				toastText: '',
				showToast: false,
				invitation: false,
				invitationInfo: '',
				dataMsg: {},
				appId:'',
				signature:'',
				timestamp:'',
				nonceStr:''
			}
		},
		methods: {
			handleInviteInfo() {
				this.toastText = "请点击右上角分享给好友";
				this.typeToast = "text";
				this.showToast = true;
			},
			handleInvite() {
				let that = this;
				wx.config({
					debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
					appId: this.appId, // 必填，公众号的唯一标识
					timestamp: this.timestamp, // 必填，生成签名的时间戳
					nonceStr: this.nonceStr, // 必填，生成签名的随机串
					signature: this.signature, // 必填，签名，见附录1
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
					that.show2 = false;
				})
				wx.error(function(res) {
					this.toastText = "err:" + res.val();
					this.typeToast = "text";
					this.showToast = true;
		            // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
		        });
			},
			handleViewRecord() {
				this.$router.push({
					name: '查看邀请记录'
				});
			},
			handleGet() {
				this.$http.post('getCardUrlInfo.action', {
    				openId:this.token,
					reqOpenId: this.reqOpenId,
					activityId: this.activityId
				}).then((res) => {
					let data = res.data,
						code = data.returnCode,
						msg = data.returnMsg;
					if(code == '0') {
						window.location.href = msg;
						console.log(JSON.stringify(msg) + "getCardUrlInfo")
					}
				});
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
//			if(window.location.href.split('=')[1]){
//				this.token=window.location.href.split('=')[1];
//				localStorage.setItem("token",this.token);
//			}else if(localStorage.getItem("token")){
//				this.token=localStorage.getItem("token");
//			}
 			if(localStorage.getItem("token")){
				this.token=localStorage.getItem("token");
			}
			let url = window.location.href;
			let params = url.split("?")[1];
			if(params && params.split("&").length > 1) {
				let param1 = params.split("&")[0];
				let param2 = params.split("&")[1];
				let param3 = params.split("&")[2];
				let openId = param1.split("=")[1];
				this.token=openId;
				this.$http.post('getSignInfo.action', {
					openId:openId,
					url: encodeURIComponent(window.location.href.split('#')[0])
				}).then((res) => {
					let data = res.data,
						code = data.returnCode,
						msg = data.returnMsg;
					this.appId = msg.appId; // 必填，公众号的唯一标识
					this.timestamp = msg.timestamp; // 必填，生成签名的时间戳
					this.nonceStr = msg.nonceStr; // 必填，生成签名的随机串
					this.signature = msg.signature; // 必填，签名，见附录1
				})
				let reqOpenId = param2.split("=")[1];
				this.reqOpenId = reqOpenId;
				let activityId = param3.split("=")[1];
				this.activityId = activityId;
				localStorage.setItem("token", openId);
				this.$nextTick(function() {
					this.$http.post('I_SCRM_WX_INTERFACE_007.action', {
    					openId:this.token,
						activityId: activityId,
						reqOpenId: reqOpenId
					}).then((res) => {
						let data = res.data,
							code = data.returnCode,
							msg = data.returnMsg;
						if(msg.isMem=="是"){
							this.invitation = false;
						}else{
							this.invitation = true;
						}
						this.show2 = false;
						//console.log(JSON.stringify(data) + '007')
						if(code == '0') {
							this.invitationInfo = msg.activityDesc.content;
							this.$http.post('I_SCRM_WX_INTERFACE_049.action', {
	    						openId:this.token,
								id: msg.id
							}).then((resInv) => {
	//							console.log(JSON.stringify(resInv.data))
								if(resInv.data.returnCode == '0') {
									this.dataMsg = resInv.data.returnMsg;
									this.handleInvite();
								}
							});
						}
					});
				})
			} else {
				if(window.location.href.split('=')[1]){
					this.token=window.location.href.split('=')[1];
					localStorage.setItem("token",this.token);
				}
				this.$http.post('getSignInfo.action', {
					openId:this.token,
					url: encodeURIComponent(window.location.href.split('#')[0])
				}).then((res) => {
					let data = res.data,
						code = data.returnCode,
						msg = data.returnMsg;
					this.appId = msg.appId; // 必填，公众号的唯一标识
					this.timestamp = msg.timestamp; // 必填，生成签名的时间戳
					this.nonceStr = msg.nonceStr; // 必填，生成签名的随机串
					this.signature = msg.signature; // 必填，签名，见附录1
				})
				this.$http.post('I_SCRM_WX_INTERFACE_007.action',{
    				openId:this.token,
				}).then((res) => {
					let data = res.data,
						code = data.returnCode,
						msg = data.returnMsg;
//					console.log(JSON.stringify(data) + '007')
					if(code == '0') {
						this.invitationInfo = msg.activityDesc.content;
						this.$http.post('I_SCRM_WX_INTERFACE_049.action', {
    						openId:this.token,
							id: msg.id
						}).then((resInv) => {
//							console.log(JSON.stringify(resInv.data))
							if(resInv.data.returnCode == '0') {
								this.dataMsg = resInv.data.returnMsg;
								this.handleInvite();
							}
						});
					}
				});
			}
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
	.img-box-invitation {
		width: 100%;
		height: auto;
		border-radius: 10*@rem;
		margin: 0*@rem auto 120*@rem;
		overflow: hidden;
		img {
			width: 100%;
		}
	}
	
	.btn-invitation {
		position: absolute;
		bottom: 0*@rem;
		/*left: 50%;*/
		display: flex;
		justify-content: space-around;
		width:100%;
		height: 80*@rem;
		background: #eee;
		padding: 20*@rem 0;
		/*margin-left: -335*@rem;*/
	}
</style>