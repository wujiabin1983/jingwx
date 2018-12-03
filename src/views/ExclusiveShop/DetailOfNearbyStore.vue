<!--附近门店详情-->
<template lang="html">
	<box class="app">
		<div class="app-container">
			<div class="img-box-detail-store">
				<img :src="groupForm.storeUrl" alt="">
			</div>
			<div class="store-info-detail-store">
				<group class="dsh-group-no-border">
					<cell class="dsh-cell" :title="groupForm.storeName" value="1111">
						<div class="cell-name-detail-store">
							<img src="../../assets/time.png" alt="" v-show="timeIsShow">
							<span v-show="timeIsShow">{{groupForm.businessTime}}</span>
						</div>
					</cell>
					<dsh-br></dsh-br>
					<cell class="dsh-cell cell-address-detail-store" :title="groupForm.storeAdd" is-link @click.native="loadingOption">
						<img slot="icon" src="../../assets/location.png" alt="">
					</cell>
					<dsh-br :height="20"></dsh-br>
					<cell class="dsh-cell cell-phone-detail-store" :title="groupForm.storeTel" is-link @click.native="handleCallPhone">
						<img slot="icon" src="../../assets/iphone.png" alt="">
					</cell>
					<dsh-br :height="20"></dsh-br>
					<cell class="dsh-cell" title="门店活动" value="更多" is-link @click.native="storeActivity"></cell>
				</group>
				<dsh-button class="btn-set" type="primary" v-if="flag" :size="490" text="设为我的专属门店" @click.native="handleSet"></dsh-button>
				<div v-transfer-dom>
					<x-dialog v-if="showPhone" class="dialog-phone">
						<img :src="img.close" class="vux-close" @click="showPhone=false">
						<div class="tel">
							<p>{{groupForm.phone}}</p>
						</div>
						<div class="btn">
							<dsh-button class="cancel" type="default" :size="218" text="取消" @click.native="showPhone=false"></dsh-button>
							<a :href="`tel:${groupForm.phone}`">
								<dsh-button class="sure" type="primary" :size="218" text="确认"></dsh-button>
							</a>
						</div>
					</x-dialog>
				</div>
			</div>
			<loading :show="show2" text=""></loading>
			<!--<img id="icon-home" :src="home" alt="" v-if="$route.path != '/'" @click="handleBackHome">-->
			<toast v-model="show" type="success" width="5rem">{{showToast}}</toast>
		</div>
	</box>
</template>

<script>
	import {Loading, cookie ,Box, Group, XInput, PopupPicker, Cell, XDialog, Toast,TransferDomDirective as TransferDom } from 'vux'
	const DshButton = () =>
		import('@/components/DshButton/DshButton.vue').then(m => m.default)
	const DshBr = () =>
		import('@/components/DshBr/DshBr.vue').then(m => m.default)
	import home from '@/assets/home.png'
	import ActivePhone from '@/assets/ActivePhone.png'
	import close from '@/assets/close.png'
	export default {
		name: '专属导购',
		directives: {
			TransferDom
		},
		components: {
			Box,
			Group,
			DshBr,
			XInput,
			Cell,
			DshButton,
			XDialog,
			Loading,
			Toast
		},
		data() {
			return {
				home:home,
				token:'',
				flag:false,//设为专属门店按钮标识
				showToast:'',//提示信息文字
				show:false,//提示信息标识
				show2:false,//加载窗
				timeIsShow:false,
				img: {
					ActivePhone: ActivePhone,
					close: close
				},
				showPhone: false,
				groupForm: {},
				data:{},
				storeId:'',
			}
		},
		methods: {
			storeActivity(){
				sessionStorage.setItem('storeDetailId',this.groupForm.storeId);
				this.$router.push({
					name: '门店活动'
				});
			},
		    handleBackHome() {
		      this.$router.push({
		        name: '会员中心首页'
		      });
		    },
			handleCallPhone() {
				var number =this.data.storeTel;
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
			handleSet() {
				this.show2 = true;
				setTimeout(() => {
					this.show2 = false;
				}, 3000)
				this.$http.post('I_SCRM_WX_INTERFACE_053.action', {
					openId:this.token,
					"storeId": this.storeId
				}).then((res) => {
					let data = res.data,
						code = data.returnCode,
						msg = data.returnMsg;
					console.log(JSON.stringify(data))
					if(code == '0') {
						this.show2 = false;
						this.loadingDataInfo();
						this.showToast=msg;
						this.show= true;
					}
				});
			},
			loadingOption(){
				this.show2 = true;
				setTimeout(() => {
					this.show2 = false;
				}, 3000)
				this.$http.post('getSignInfo.action', {
					openId:this.token,
					url: encodeURIComponent(window.location.href.split('#')[0])
				}).then((res) => {
					let data = res.data,
						code = data.returnCode,
						msg = data.returnMsg;
					if(code == '0') {
						this.show2 = false;
						let that =this;
						wx.config({
							debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
							appId: msg.appId, // 必填，公众号的唯一标识
							timestamp: msg.timestamp, // 必填，生成签名的时间戳
							nonceStr: msg.nonceStr, // 必填，生成签名的随机串
							signature: msg.signature, // 必填，签名，见附录1
							jsApiList: ['openLocation','translateVoice']
							// 必填，需要使用的JS接口列表，所有JS接口列表见附录2
						});
						wx.ready(function() {
							wx.openLocation({
								latitude: parseFloat(that.data.latitude), // 纬度，浮点数，范围为90 ~ -90
								longitude: parseFloat(that.data.longitude), // 经度，浮点数，范围为180 ~ -180。
								name: that.data.storeName, // 位置名
								address: that.data.storeAdd, // 地址详情说明
								scale: 9, // 地图缩放级别,整形值,范围从1~28。默认为最大
								infoUrl: '' // 在查看位置界面底部显示的超链接,可点击跳转
							});
						})
					}
				});
			},
			loadingDataInfo(){
				this.$http.post('I_SCRM_WX_INTERFACE_010.action', {
					openId:this.token,
					"storeId": this.storeId
				}).then((res) => {
					let data = res.data,
						code = data.returnCode,
						msg = data.returnMsg;
					if(code == '0') {
						if(JSON.stringify(msg)!="{}"){
							let arrTel='';
							if(msg.storeTel!=""){
								arrTel = msg.storeTel.split(";");
								if(arrTel[1]==""){
									msg.storeTel=arrTel[0];	
								}
							}
							this.groupForm = msg;
							this.data=msg;
							this.data.latitude=parseFloat(this.data.latitude);
							this.data.longitude=parseFloat(this.data.longitude);
							if(msg.storeUrl==""){
								this.groupForm.storeUrl=ActivePhone;
							}
							if(msg.businessTime.length==1){
								this.timeIsShow=false;
							}else{
								this.timeIsShow=true;
							}
							if(msg.flag=="是"){
								this.flag=false;
							}else{
								this.flag=true;
							}
						}
					}
				});
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
			if(sessionStorage.getItem('storeDetailId')){
				this.storeId=sessionStorage.getItem('storeDetailId');
				console.log(this.storeId)
				this.$nextTick(function() {
					this.loadingDataInfo();
				})
			}
		}
	}
</script>

<style lang="less">
	.img-box-detail-store {
		width: 100%;
		height: 322*@rem;
		background: #CCC;
		img {
			width: 100%;
			height: 322*@rem;
		}
	}
	
	.store-info-detail-store {
		.dsh-group-no-border {
			.weui-cell {
				height: 74*@rem;
			}
		}
		// 门店名称
		.cell-name-detail-store {
			display: flex;
			align-items: center;
			img {
				width: 34*@rem;
				height: 34*@rem;
				margin-right: 22*@rem;
			}
		}
		// 地址
		.cell-address-detail-store {
			.vux-label {
				padding-right: 18*@rem;
				padding-left: 15*@rem;
			}
			img {
				display: flex;
				align-items: center;
				width: 27*@rem;
				height: 34*@rem;
				// padding-left: (52 - 15)*@rem;
			}
		}
		// 电话号码
		.cell-phone-detail-store {
			.vux-label {
				padding-right: 18*@rem;
				padding-left: 15*@rem;
			}
			img {
				display: flex;
				align-items: center;
				width: 27*@rem;
				height: 34*@rem;
				// padding-left: (52 - 15)*@rem;
			}
		}
		// 设为我的专属门店
		.btn-set {
			margin-top: (222 * 0.6)*@rem;
		}
	}
	
	.dialog-phone {
		position: relative;
		width: 580*@rem;
		height: 226*@rem;
		.vux-close {
			position: absolute;
			right: 5*@rem;
			top: 5*@rem;
		}
		.tel {
			width: 580*@rem;
			height: 226*@rem;
			font-size: 36*@rem;
			color: #3d3d3d;
			p {
				padding-top: 108*@rem;
			}
		}
		.btn {
			display: flex;
			justify-content: space-around;
			height: 80*@rem;
			padding-bottom: 24*@rem;
			// .cancel, .sure {
			//   margin-mottom: 24*@rem;
			// }
		}
	}
</style>