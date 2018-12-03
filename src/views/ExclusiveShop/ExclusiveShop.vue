<!--专属导购-->
<template lang="html">
	<box class="app">
		<!-- <x-header :left-options="{backText: ''}">set empty back text</x-header> -->
		<div class="app-container">
			<div class="dsh-group"></div>
			<!-- 有专属导购 -->
			<div class="haveExclusiveShop" v-if="showExclusiveShop == '有专属门店'">
				<div class="header-exclusive-shop" :style="exclusiveShopStyle" >
					<div class="icon-active">
						<!-- 扫描二维码 -->
						<img class="qrcode" src="../../assets/saomiao.png" alt="" @click="handleQrcode">
						<!-- 微信 -->
						<img class="wx" src="../../assets/weixin.png" alt="" @click="weixinClosePage">
					</div>
					<div class="img-box-header-exclusive-shop">
						<img :src="msgData.headUrl" alt="">
					</div>
					<p class="name-exclusive-shop">{{msgData.guideName}}</p>
				</div>
				<div class="container-exclusive-shop">
					<dsh-br :height="30"></dsh-br>
					<group class="dsh-group-no-border">
						<!-- <popup-picker class="dsh-picker" title="专属门店" :data="nameItems" v-model="groupForm.name" placeholder="请输入专属门店"></popup-picker> -->
						<cell class="dsh-cell" title="专属门店" :value="msgData.storeName" :is-link="isStoreName" @click.native="handleSelectStore"></cell>
						<dsh-br></dsh-br>
						<cell class="dsh-cell" title="电话" :value="msgData.mobile" is-link @click.native="handleCallPhone"></cell>
						<dsh-br></dsh-br>
						<cell class="dsh-cell" title="申请服务" is-link @click.native="handleAsk"></cell>
					</group>
				</div>
			</div>
			<!-- 没有专属导购 -->
			<div class="noExclusiveShop" v-if="showExclusiveShop == '没有专属门店'">
				<group class="dsh-group-no-border">
					<cell class="dsh-cell" title="专属门店" :value="!msgData.storeName ? '无' : msgData.storeName" :is-link="storeFlag" @click.native="handleSelectStore"></cell>
				</group>
				<div class="img-box-qrcode-exclusive-shop" @click="handleQrcode">
					<img src="../../assets/saoyisao.png" alt="">
				</div>
				<p class="explain">在专属门店扫描导购二维码即可拥有专属导购</p>
			</div>
			<loading :show="show2" text=""></loading>
		</div>
	</box>
</template>

<script>
	import background from '@/assets/background.png'
	import { Box, Group, Cell, Loading } from 'vux'
	// const ToggleText = () => import('./ToggleText.vue').then(m => m.default)
	const DshButton = () =>
		import('@/components/DshButton/DshButton.vue').then(m => m.default)
	const DshBr = () =>
		import('@/components/DshBr/DshBr.vue').then(m => m.default)
	const DetailOfNearbyStore = () =>
		import('./DetailOfNearbyStore.vue').then(m => m.default)
	const ApplicationService = () =>
		import('./ApplicationService.vue').then(m => m.default)

	import HeadExclusiveShop from '@/assets/HeadExclusiveShop.png'
	export default {
		name: '专属导购',
		components: {
			Box,
			Group,
			DshBr,
			Cell,
			DshButton,
			Loading
		},
		data() {
			return {
				token:'',
	    	exclusiveShopStyle:{
		  		'background-image': `url(${background})`
	    	},
				background:background,
				show2:false,
				isStoreName:false,
				storeFlag: false,
				img: {
					HeadExclusiveShop: HeadExclusiveShop
				},
				userName: '江小布',
				groupForm: {
					store: '',
					phone: '',
					headUrl:''
				},
				msgData: {},
				showExclusiveShop: '',
				// 专属门店
				showExclusiveShopInfo: false,
				// 申请服务
				showApplicationService: false,
			}
		},
		methods: {
			weixin_ClosePage(){
				WeixinJSBridge.call('closeWindow');
			},
			weixinClosePage(){
				if (typeof WeixinJSBridge == "undefined") {
			        if (document.addEventListener) {
			            document.addEventListener('WeixinJSBridgeReady', weixin_ClosePage, false);
			        } else if (document.attachEvent) {
			            document.attachEvent('WeixinJSBridgeReady', weixin_ClosePage);
			            document.attachEvent('onWeixinJSBridgeReady', weixin_ClosePage);
			        }
			    } else {
			        weixin_ClosePage();
			    }
			},
			// 选择专属门店
			handleSelectStore() {
				sessionStorage.setItem('storeDetailId',this.msgData.storeId);
				if(this.msgData.storeId != "") {
					this.$router.push({
						name: '附近门店详情'
					});
				}
			},
			handleCallPhone() {
				var number =this.msgData.mobile;
				if (this.isIosBrowser) {
				  	let a = document.createElement('a');
				  	a.href = 'tel:' + number;
				  	a.style.visibility = 'hidden';
				 	document.body.appendChild(a);
				  	a.click();
				} else {
				  	window.location.href = 'tel:' + number;
				}
			},
			// 申请服务
			handleAsk() {
				// this.showApplicationService = true;
				this.$router.push({
					name: '申请服务'
				});
			},
			// 二维码
			handleQrcode() {
				this.show2=true;
		    	setTimeout(() => {
					this.show2=false;
		      	}, 3000)
				this.$http.post('getSignInfo.action', {
					openId:this.token,
					url: encodeURIComponent(window.location.href.split('#')[0])
				}).then((res) => {
					let data = res.data,
						code = data.returnCode,
						msg = data.returnMsg,
						that = this;
					if(code == '0') {
						this.show2=false;
						wx.config({
							debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
							appId: msg.appId, // 必填，公众号的唯一标识
							timestamp: msg.timestamp, // 必填，生成签名的时间戳
							nonceStr: msg.nonceStr, // 必填，生成签名的随机串
							signature: msg.signature, // 必填，签名，见附录1
							jsApiList: ['scanQRCode']
							// 必填，需要使用的JS接口列表，所有JS接口列表见附录2
						});
						wx.ready(function() {
							wx.scanQRCode({
								needResult: 0, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
								scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
								success: function(res) {
									this.loadingData();
								}
							});
						}, function(data) {
							this.toastText = "系统繁忙，请刷新页面后重试";
							this.showToast = true;
							this.toastType = "warn";
						})
					}
				});
			},
			loadingData(){
				// 是否有专属导购
				this.$http.post('I_SCRM_WX_INTERFACE_026.action',{
					openId:this.token,
				}).then((res) => {
					let data = res.data,
						code = data.returnCode,
						msg = data.returnMsg;
					if(code == '0') {
						this.msgData = msg;
						if(msg.headUrl==""){
							this.msgData.headUrl=HeadExclusiveShop;
						}
						if(msg.storeName!=""){
							this.isStoreName=true;
						}else{
							this.isStoreName=false;
						}
						console.log(JSON.stringify(msg) + "026")
						this.storeFlag = !msg.storeId == '';
						if(msg.guideId == '') {
							this.showExclusiveShop = '没有专属门店';
							if(!sessionStorage.getItem('testDetailExclusiveShop')) {
								return false
							} else {
								this.showExclusiveShop = '有专属门店';
							}
						} else {
							this.showExclusiveShop = '有专属门店';
						}
					}
				})
			}
		},
		computed: {

		},
		created() {
			document.oncontextmenu = function(e) {
				//或者return false;
				e.preventDefault();
			};
			if(window.location.href.split('=')[1]){
				this.token=window.location.href.split('=')[1];
				localStorage.setItem("token",this.token);
			}else if(localStorage.getItem("token")){
				this.token=localStorage.getItem("token");
			}
			this.$http.post('getSignInfo.action', {
				openId:this.token,
				url: encodeURIComponent(window.location.href.split('#')[0])
			}).then((res) => {
				let data = res.data,
					code = data.returnCode,
					msg = data.returnMsg,
					that = this;
				if(code == '0') {
					this.show2=false;
					wx.config({
						debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
						appId: msg.appId, // 必填，公众号的唯一标识
						timestamp: msg.timestamp, // 必填，生成签名的时间戳
						nonceStr: msg.nonceStr, // 必填，生成签名的随机串
						signature: msg.signature, // 必填，签名，见附录1
						jsApiList: ['hideMenuItems']
						// 必填，需要使用的JS接口列表，所有JS接口列表见附录2
					});
					wx.ready(function() {
						wx.hideMenuItems({
			                menuList: ["menuItem:share:timeline",//分享到朋友圈
			                	"menuItem:share:appMessage", //发送给朋友
			              		"menuItem:share:qq", //分享到QQ
			                	"menuItem:share:weiboApp", //分享到Weibo
			                	"menuItem:favorite", //收藏
			                	"menuItem:share:facebook", //分享到FB
			                	"menuItem:share:QZone", //分享到 QQ 空间
			                	"menuItem:editTag", //编辑标签
			                	"menuItem:delete", //删除
			                	"menuItem:copyUrl", //复制链接
			                	"menuItem:originPage", //原网页
			                	"menuItem:readMode", //阅读模式
			                	"menuItem:openWithQQBrowser", //在QQ浏览器中打开
			                	"menuItem:openWithSafari", //在Safari中打开
			                	"menuItem:share:email", //邮件
			                	"menuItem:share:brand"] //一些特殊公众号
			                	// 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮
			            })
					})
				}
			});
			this.loadingData();
		}
	}
</script>

<style lang="less">
	.haveExclusiveShop {
		.header-exclusive-shop {
			background-size:100% ;
			padding-top: 30*@rem;
			h2 {
				text-align: center;
				font-size: 34*@rem;
				font-weight: normal;
				color: #FFF;
				margin-bottom: 45*@rem;
			}
			.icon-active {
				display: flex;
				justify-content: space-between;
				margin: 0 40*@rem 0 38*@rem;
				.qrcode {
					width: 38*@rem;
					height: 39*@rem;
				}
				.wx {
					width: 50*@rem;
					height: 42*@rem;
				}
			}
			.img-box-header-exclusive-shop {
				width: 161*@rem;
				height: 161*@rem;
				border: 3*@rem solid #78cef0;
				border-radius: 50%;
				margin: 28*@rem auto 34*@rem;
				background: #FFF;
				overflow: hidden;
				img {
					width: 161*@rem;
					height: 161*@rem;
				}
			}
			.name-exclusive-shop {
				font-size: 26*@rem;
				color: #FFF;
				text-align: center;
				padding-bottom: 36*@rem;
			}
		}
	}
	
	.noExclusiveShop {
		.img-box-qrcode-exclusive-shop {
			width: 166*@rem;
			height: 166*@rem;
			margin: 196*@rem auto 100*@rem;
			img {
				width: 166*@rem;
				height: 166*@rem;
			}
		}
		.explain {
			font-size: 26*@rem;
			color: #3b3b3b;
			text-align: center;
		}
	}
	
	.exclusive-shop-info-set {
		// 设为我的专属门店
		.btn-set {
			margin-top: (222 * 0.6 - 50)*@rem;
		}
	}
	
	.exclusive-shop-application-service {
		.btn-register {
			padding-top: (394 * 0.6 - 50)*@rem;
		}
		.a-application-recard {
			margin-top: 42*@rem;
			font-size: 30*@rem;
			color: #5486dd;
			text-align: center;
		}
	}
</style>