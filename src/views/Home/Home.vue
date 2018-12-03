<!--会员首页-->
<template lang="html">
	<box class="app">
		<div class="app-container" v-if="isWechat">
			<div class="dsh-group"></div>
			<div class="home-foreground">
				<!-- 首页(上) -->
				<div class="header-home" v-show="flagShow">
					<img class="img-header-home" :src="!pageData.bgUrl ? '' : pageData.bgUrl.head" alt="">
					<!-- logo -->
					<div class="logo-box">
						<div class="logo" v-if="pageData.isLogo != '不显示'">
							<img :src="!pageData.isLogo ? img.logoHome : pageData.isLogo" alt="">
						</div>
					</div>
					<div class="qrcode" @click="qrcodeFn">
						<img :src="img.qrcode">
					</div>
					<div class="footer" v-if="pageData.isMem == '是'">
						<span>
							<!-- 会员等级 -->
							<span>{{pageData.isLevel}}</span>
							<!-- 电子卡号 -->
							<span v-if="pageData.memCardOption === '不显示'"></span>
							<span v-else>{{pageData.memCardOption}}</span>
						</span>
					</div>
					<span v-else @click="handleIsLevel" class="is-level">请激活手机号</span>
				</div>
				<!-- 首页(下) -->
				<!-- <dsh-br :style="pageData.tempName == '模板2' ? {background: 'transparent'} : {background: '#f8f8f8'}"></dsh-br> -->
				<div class="header-content" v-for="item in pageData.dataList">
					<!-- 图文导航 -->
					<div class="grid-nav-home" v-if="item.type == '图文导航'">
						<grid :cols="4" :show-lr-borders="false" >
							<grid-item :link="pageData.isMem == '是'?subItem.link:''" @click.native="clickInfo" :label="subItem.name" v-for="subItem in item.navSet" :key="subItem.picture">
								<img slot="icon" :src="subItem.picture">
							</grid-item>
						</grid>
					</div>
					<!-- 文本导航 -->
					<div class="group-nav-home textNav" v-if="item.type == '文本导航'">
						<!-- {{item.navSet}} -->
						<group class="dsh-group">
							<cell v-for="subItem in item.navSet" :key="subItem.name" @click.native="clickInfo"  :title="subItem.name" :link="pageData.isMem == '是'?subItem.link:''" class="group-nav-item-home">
								<img slot="icon" :src="subItem.picture" />
							</cell>
						</group>
					</div>
					<!-- 图片 -->
					<div class="dsh-picture" v-if="item.type == '图片'">
						<img :src="item.navSet[0].picture" alt="">
					</div>
					<!-- 辅助空白 -->
					<div class="dsh-br" v-if="item.type == '辅助空白'"></div>
					<!-- 辅助线 -->
					<div class="dsh-hr" v-if="item.type == '辅助线'">.</div>
					<!-- 标题 -->
					<h2 class="dsh-title" v-if="item.type == '标题'">{{item.navSet[0].title}}</h2>
				</div>
			</div>
			<div v-if="pageData.tempName=='模板1'" class="home-background" style="background-color: #fff;"></div>
			<div v-else class="home-background"  :style="{backgroundImage: `url(${pageData.bgUrl.all})`, opacity: `${pageData.bgTransparency/100}`}"></div>
			<!--<div class="dsh-background"></div>-->
		</div>
		<div class="noWechat" v-else>
			<img :src="warning"/>
			<p>请在微信客户端打开连接</p>
		</div>
		<loading :show="show2" text=""></loading>
		<popup v-model="show" height="100%" style="background: none;">
			<div class="container-pop">
	        	<div class="boxQrcode">
        			<div class="header-home" v-show="flagShow">
						<img class="img-header-home" :src="!pageData.bgUrl ? '' : pageData.bgUrl.head" alt="">
						<div class="footer">
							<!-- 会员等级 -->
							<span v-if="pageData.isLevel == '不显示'"></span>
							<span v-else>{{pageData.isLevel}}</span>
							<!-- 电子卡号 -->
							<span v-if="pageData.memCardOption === '不显示'"></span>
							<span v-else>{{pageData.memCardOption}}</span>
						</div>
					</div>
					<div class="qrcodeImg">
						<div class="qrcodeImgBg">
							<img :src="qrcode"/>
						</div>
					</div>
	        	</div>
			</div>
			<div class="container-close" @click="closeQrcode">
			</div>
		</popup>
		<toast v-model="showToast" type="text" width="8rem">{{toastText}}</toast>
	</box>
</template>

<script>
	import { XHeader, Group, Box, Flexbox, FlexboxItem, Grid, GridItem, Cell,XDialog, Popup,Loading ,Toast} from 'vux'
	const DshButton = () =>
		import('@/components/DshButton/DshButton.vue').then(m => m.default)
	const DshBr = () =>
		import('@/components/DshBr/DshBr.vue').then(m => m.default)

	import wodeziliao from '@/assets/wodeziliao.png'
	import wodequan from '@/assets/wodequan.png'
	import wodedingdan from '@/assets/wodedingdan.png'
	import wodetequan from '@/assets/wodetequan.png'
	import yaoqingyouli from '@/assets/yaoqingyouli.png'
	import fujinmendian from '@/assets/fujinmendian.png'
	import zhuanshudaogou from '@/assets/zhuanshudaogou.png'
	import wodejifen from '@/assets/wodejifen.png'
	import jifenduihuan from '@/assets/jifenduihuan.png'
	import mendianhuodong from '@/assets/mendianhuodong.png'
	import wodedizhi from '@/assets/wodedizhi.png'
	import bangdinghuiyuanka from '@/assets/bangdinghuiyuanka.png'
	import shenqingfuwu from '@/assets/shenqingfuwu.png'

	import qrcode from '@/assets/qrcode.png'
	import ActivePhone from '@/assets/ActivePhone.png'
	import logoHome from '@/assets/logoHome.png'
	import warning from '@/assets/warning2.png'
	export default {
		name: '',
		components: {
			DshButton,
			DshBr,
			Group,
			Box,
			Flexbox,
			FlexboxItem,
			Grid,
			GridItem,
			Cell,
			XDialog ,
			Popup,
			Toast,
			Loading
		},
		data() {
			return {
				toastText:"请您先激活手机号成为会员！",
				showToast:false,
				disabled:false,
				warning:warning,
				show2:true,
				show:false,
				token:'',
				flagShow:false,
				isWechat:false,
				img: {
					qrcode: qrcode,
					ActivePhone: ActivePhone,
					logoHome: logoHome
				},
				qrcode:'',
				opacity:'',
				gridNavItems: [{
						label: '我的资料',
						src: wodeziliao,
						link: {
							name: "我的资料"
						}
					},
					{
						label: '我的券',
						src: wodequan,
						link: {
							name: "我的券"
						}
					},
					{
						label: '我的订单',
						src: wodedingdan,
						link: {
							name: "我的订单"
						}
					},
					{
						label: '我的特权',
						src: wodetequan,
						link: {
							name: "我的特权"
						}
					},
					{
						label: '会员邀请',
						src: yaoqingyouli,
						link: {
							name: "会员邀请"
						}
					},
					{
						label: '附近门店',
						src: fujinmendian,
						link: {
							name: "附近门店"
						}
					},
					{
						label: '专属导购',
						src: zhuanshudaogou,
						link: {
							name: "专属导购"
						}
					},
					{
						label: '我的积分',
						src: wodejifen,
						link: {
							name: "我的积分"
						}
					},
				],
				groupNavItems: [{
						title: '积分兑换',
						src: jifenduihuan,
						link: {
							name: '积分兑换'
						}
					},
					{
						title: '门店活动',
						src: mendianhuodong,
						link: {
							name: '门店活动'
						}
					},
					{
						title: '我的地址',
						src: wodedizhi,
						link: {
							name: '我的地址'
						}
					},
					{
						title: '绑定会员卡',
						src: bangdinghuiyuanka,
						link: {
							name: '绑定会员卡'
						}
					},
					{
						title: '申请服务',
						src: shenqingfuwu,
						link: {
							name: '申请服务'
						}
					},
					{
						title: '我的会员卡',
						src: shenqingfuwu,
						link: {
							name: '我的会员卡'
						}
					},
					{
						title: '完善个人资料',
						src: shenqingfuwu,
						link: {
							name: '完善个人资料'
						}
					},
					{
						title: '会员邀请',
						src: shenqingfuwu,
						link: {
							name: '会员邀请'
						}
					},
					{
						title: '激活手机',
						src: shenqingfuwu,
						link: {
							name: '激活手机'
						}
					},
					{
						title: '注册',
						src: shenqingfuwu,
						link: {
							name: '注册'
						}
					},
				],
				pageData: {
					pageName: '',
					bgUrl: '',
					tempId: '',
					tempName: '',
					memCardOption: '',
					isLogo: '',
					isLevel: '',
					bgTransparency: '',
					dataList: ''
				},
			}
		},
		methods: {
			closeQrcode(){
				this.show=false;
			},
			clickInfo(){
				if(this.pageData.isMem != '是'){
					this.toastText="请您先激活手机号成为会员！";
					this.showToast=true;
				}
			},
			qrcodeFn(){
				this.show=true;
				this.$http.post('I_SCRM_WX_INTERFACE_058.action',{
					openId:this.token
				}).then((res) => {
					let data = res.data,
						code = data.returnCode,
						msg = data.returnMsg;
					if(code == '0') {
						this.qrcode=msg;
//						this.qrcode = 'https://ws1.sinaimg.cn/large/663d3650gy1fq6824ur1dj20ia0pydlm.jpg'
//						this.showHideOnBlur=true;
					}
				})
			},
			handleIsLevel() {
				if(!this.pageData.memCardOption) {
					//      this.$router.push({
					//        name: '激活手机'
					//      });
					this.disabled=true;
					this.show2=true;
					this.$http.post('getCardUrlInfo.action',{
						openId:this.token
					}).then((res) => {
						this.disabled=false;
						let data = res.data,
							code = data.returnCode,
							msg = data.returnMsg;
						if(code == '0') {
							window.location.href = msg;
							// console.log(JSON.stringify(msg) + "getCardUrlInfo")
						}else{
							this.show2=false;
						}
					});
				}
			},
			loadingAddr(longitude,latitude){
				this.$http.post('I_SCRM_WX_INTERFACE_061.action',{
					openId:this.token,
					longitude:longitude,
					latitude:latitude
				}).then((res) => {
					let data = res.data,
						code = data.returnCode,
						msg = data.returnMsg;
					if(code == '0') {
						// console.log(JSON.stringify(msg) + "getCardUrlInfo")
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
			document.oncontextmenu = function(e) {
				e.preventDefault();
			};
			if(window.location.href.split('=').length<=2){
				if(window.location.href.split('=')[1]){
					this.token=window.location.href.split('=')[1];
					localStorage.setItem("token",this.token);
				}else if(localStorage.getItem("token")){
					this.token=localStorage.getItem("token");
				}
			}
			if(this.token!=""){
				this.$http.post('I_SCRM_WX_INTERFACE_002.action',{
					openId:this.token
				}).then((res) => {
					let data = res.data,
						code = data.returnCode,
						msg = data.returnMsg;
					if(code == '0') {
						this.flagShow=true;
//						console.log(JSON.stringify(msg) + "002");
						document.title =msg.pageName;
						this.pageData = msg;
					}else{
						this.toastText="服务器连接超时！";
						this.showToast=true;
					}
				});
				this.$nextTick(function() {
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
								jsApiList: ['getLocation']
								// 必填，需要使用的JS接口列表，所有JS接口列表见附录2
							});
							wx.ready(function() {
								if(that.pageData.getAddr=="是"){
									wx.getLocation({
										success: function(res) {
											var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
											var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
											that.$nextTick(function() {
												that.loadingAddr(longitude, latitude);
											})
										},
										error: function(res) {
										}
									});
								}
							})
						}
					})
				})
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
	.test-box {
		float: left;
		width: 6.5333rem;
		height: 1.2rem;
		border-radius: 0.6rem;
		background: red;
		margin-top: 20px;
	}

	.vux-cell-primary {
		width: 40%;
	}

	.header-home {
		position: relative;
		// width: 98%;
		height: 374*@rem;
		border-sizing: border-box;
		// padding: 10*@rem;
		background: #FFF;
		// border-radius: 20*@rem;
		img.img-header-home {
			width: 100%;
			height: 374*@rem;
			// border-radius: 10*@rem;
		}
		.is-level {
			width: 30%;
			color: #FFFFFF;
			border: 1*@rem solid #FFFFFF;
			border-radius: 15*@rem;
			position: absolute;
			bottom: 35*@rem;
			left: 35%;
			text-align: center;
		}
		.logo-box {
			display: flex;
			position: absolute;
			// left: .6rem /* 45/75 */;
			// top: .266667rem /* 20/75 */;
			left: 50%;
			top: 50%;
			transform: translate(-50%, -50%);
			// width: 4rem /* 300/75 */;
			width: 100*@rem;
			height: 100*@rem;
			border-radius: 50%;
			border: 2px solid #FFF;
			.logo {
				width: 100*@rem;
				height: 100*@rem;
				// background: #FFF;
				// margin-right: .32rem /* 24/75 */;
				border-radius: 50%;
				overflow: hidden;
				img {
					width: 100*@rem;
					height: 100*@rem;
					// border-radius: 50%;
					// border: 2px solid #FFF;
				}
			}
			.title {
				display: flex;
				flex-direction: column;
				div {
					height: 50%;
				}
				.title-main {
					font-size: .4rem/* 30/75 */
					;
					color: #FFF;
				}
				.title-sub {
					font-size: .4rem/* 30/75 */
					;
					color: #FFF;
				}
			}
		}
		.qrcode {
			position: absolute;
			top: .586667rem/* 44/75 */;
			right: 40*@rem;
			width: 40*@rem;
			height: 40*@rem;
			img {
				width: 40*@rem;
				height: 40*@rem;
			}
		}
		.footer {
			position: absolute;
			left: 0;
			bottom: 0;
			// left: .586667rem/* 44/75 */;
			// bottom: .373333rem/* 28/75 */;
			width: 100%;
			height: 67*@rem;
			line-height: 67*@rem;
			background-color: rgba(0,0,0,0.2);
			text-indent: .586667rem/* 44/75 */;
			color: #FFF;
		}
	}

	// 九宫格nav导航
	.grid-nav-home {
		// padding: .293333rem;
		background: #FFF;
		// margin-bottom: 10*@rem;
		// .weui-grids:before {
		// 	border-top: none!important;
		// }
		// .weui-grid:nth-child(n+5):after {
		// 	border-bottom: none!important;
		// }
		.weui-grid__label {
			font-size: .32rem;
			text-overflow: unset!important;
		}
		.weui-grid {
			padding-top: 20*@rem!important;
			padding-bottom: 15*@rem!important;
		}
	}

	.group-nav-home {
		.weui-cell {
			font-size: .32rem/* 24/75 */;
			position: relative!important;
			// margin-left: 1.306667rem /* 98/75 */;
			// padding-left: 0;
			padding-right: .613333rem/* 46/75 */;
			padding-top: 0;
			padding-bottom: 0;
		}
		// .weui-cells:before {
		// 	border-top: none;
		// }
		.weui-cell:before {
			width: 90%;
			margin-left: 25px;
		}
		.group-nav-item-home {
			height: 1.066667rem/* 80/75 */!important;
			line-height: 1.066667rem/* 80/75 */;
		}
		img {
			display: flex;
			align-items: center;
			width: .533333rem;/* 40/75 */
			height: .533333rem;/* 40/75 */
			margin-right: .293333rem;/* 22/75 */
			
		}
	}
	.textNav{
		.group-nav-item-home {
			height: 1.4rem/* 80/75 */!important;
			line-height: 1.4rem/* 80/75 */;
		}
		.vux-label{
			font-size: 0.35rem;
		}
		img{
			width: 0.7rem;
			height: 0.7rem;
		}
	}
	.header-content {
		// 图文导航
		.grid-nav-home {
			background: none;
		}
		.weui-grid {
			padding: 20px 0;
		}
		.weui-grid:after {
			border-bottom: 0;
		}
		.weui-grid:before {
			border-right: none
		}
		// 文本导航
		.weui-cells {
			background: none;
		}
		.weui-cells:before {
			// border-top: 1*@rem solid #d9d9d9;
		}
		.weui-cells:after {
			border: none;
		}
		// 辅助空白
		.dsh-br {
			background-color: #f1f1f0;
			height: 24*@rem;
		}
		// 辅助线
		.dsh-hr {
			position: relative;
			width: 100%;
			heihgt: 24*@rem!important;
			line-height: 24*@rem!important;
			// background: blue;
			font-size: 0;
			&:after {
				content: 'sdfsdf';
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translateX(-50%);
				display: flex;
				justify-content: center;
				align-items: center;
				width: 95%;
				height: 1*@rem;
				// background: #d9d9d9;
				// margin: 0 auto;
				border-top: 1*@rem solid #D9D9D9;
			}
		}
		// 标题
		.dsh-title {
			font-size: 40*@rem;
			padding-top: 10*@rem;
			text-indent: 10*@rem;
		}
		// 图片
		.dsh-picture {
			box-sizing: border-box;
			overflow: hidden;
			img {
				width: 100%;
				display: block;
			}
		}
	}

	.home-foreground {
		position: relative;
		top: 0;
		z-index: 10;
	}
	.home-background {
		position: absolute;
		top: 0;
		width: 100%;
		background-size:100%;
		height:100%;
		z-index: 5;
	}
	.container-close{
		width: 100%;
		height: 100%;
		position: fixed;
		top: 0;
		left: 0;
		z-index: 10;
	}
	.container-pop{
		width:605*@rem;
		margin: 0 auto;
		position: relative;
		height: auto;
		z-index: 11;
	}
	.boxQrcode{
		width:605*@rem;
		margin: 0 auto;
		margin-top: 166*@rem;
		.header-home{
			height: 300*@rem;
			img{
				height: 100%;
			}
		}
		.qrcodeImg{
			background: #fff;
			overflow: hidden;
			box-sizing: border-box;
			.qrcodeImgBg{
				width: 440*@rem;
				height: 440*@rem;
				margin: 35*@rem auto;
				box-sizing: border-box;
				overflow: hidden;
				/*background: #f5f5f5;*/
				img{
					width: 440*@rem;
					height: 440*@rem;
					display: block;
					margin: 0 auto;
					box-sizing: border-box;
				}
			}
		}
	}
</style>
