<!--会员特权-->
<template lang="html">
	<box class="app dsh-box">
		<div class="app-container">
			<div class="header-home" v-show="flagShow">
				<img class="img-header-home" :src="!pageData.bgUrl ? '' : pageData.bgUrl.head" alt="">
				<!-- logo -->
				<div class="logo-box">
					<div class="logo" v-if="pageData.isLogo != '不显示'">
						<img :src="!pageData.isLogo ? img.logoHome : pageData.isLogo" alt="">
					</div>
				</div>
				<div class="footer">
					<!-- 会员等级 -->
					<span>{{pageData.isLevel}}</span>
					<!-- 电子卡号 -->
					<span v-if="pageData.memCardOption === '不显示'"></span>
					<span v-else>{{pageData.memCardOption}}</span>
				</div>
			</div>
			<div class="myPrivilege-container" v-html="msg" v-if="data">
			</div>
			<div class="myPrivilege-noOrderList" v-if="noData">
				<img :src="biaoqing" />
				<p>您暂时还没有特权信息</p>
			</div>
		</div>
	</box>
</template>

<script>
	import biaoqing from '@/assets/biaoqing.png'
	import qrcode from '@/assets/qrcode.png'
	import ActivePhone from '@/assets/ActivePhone.png'
	import logoHome from '@/assets/logoHome.png'
	import { Group, Box } from 'vux'
	const DshButton = () =>
		import('@/components/DshButton/DshButton.vue').then(m => m.default)
	export default {
		name: '我的特权',
		components: {
			DshButton,
			Box,
		},
		data() {
			return {
				img: {
					qrcode: qrcode,
					ActivePhone: ActivePhone,
					logoHome: logoHome
				},
				token: '',
				biaoqing: biaoqing,
				msg: '',
				data: false,
				noData: false,
				pageData: {},
				flagShow: false
			}
		},
		methods: {
			qrcodeFn() {
				this.$http.post('I_SCRM_WX_INTERFACE_058.action', {
					openId: this.token
				}).then((res) => {
					let data = res.data,
						code = data.returnCode,
						msg = data.returnMsg;
					if(code == '0') {
						this.qrcode = msg;
						//						this.qrcode = 'https://ws1.sinaimg.cn/large/663d3650gy1fq6824ur1dj20ia0pydlm.jpg'
						this.showHideOnBlur = true;
					}
				})
			},
			handleIsLevel() {
				if(!this.pageData.memCardOption) {
					//      this.$router.push({
					//        name: '激活手机'
					//      });

					this.$http.post('getCardUrlInfo.action', {
						openId: this.token
					}).then((res) => {
						let data = res.data,
							code = data.returnCode,
							msg = data.returnMsg;
						if(code == '0') {
							window.location.href = msg;
							// console.log(JSON.stringify(msg) + "getCardUrlInfo")
						}
					});
				}
			}
		},
		computed: {

		},
		created() {
			document.oncontextmenu = function(e) {
				//或者return false;
				e.preventDefault();
			};
			if(window.location.href.split('=')[1]) {
				this.token = window.location.href.split('=')[1];
				localStorage.setItem("token", this.token);
			} else if(localStorage.getItem("token")) {
				this.token = localStorage.getItem("token");
			}
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
							menuList: ["menuItem:share:timeline", //分享到朋友圈
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
								"menuItem:share:brand"
							] //一些特殊公众号
							// 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮
						})
					})
				}
			});
			this.$http.post('I_SCRM_WX_INTERFACE_004.action', {
				openId: this.token,
			}).then((res) => {
				let data = res.data,
					code = data.returnCode,
					msg = data.returnMsg;
				console.log(JSON.stringify(data) + "004");
				if(code == '0') {
					this.msg = msg.privilegeDesc;
					if(msg.isLogo==""&&msg.bgUrl==""){
						this.flagShow = false;
					}else{
						this.flagShow = true;
					}
					//						console.log(JSON.stringify(msg) + "002");
					this.pageData = msg;
					if(this.msg == "") {
						this.noData = true;
						this.data = false;
					} else {
						this.noData = false;
						this.data = true;
					}
				}
			});
		}
	}
</script>

<style lang="less">
	.myPrivilege-container {
		padding:  0*@rem;
		p {
			line-height: 60*@rem;
			font-size: 28*@rem;
		}
		ul,
		li {
			list-style: none;
		}
		ul {
			padding-left: 45*@rem;
		}
		img {
			width: 100%;
			display: block;
		}
	}
	
	.myPrivilege-noOrderList {
		padding-top: 378*@rem;
		img {
			width: 348*@rem;
			height: 216*@rem;
			display: block;
			margin: 0 auto;
		}
		p {
			text-align: center;
			margin-top: 56*@rem;
			color: #aaa;
		}
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
			color: rgba(0, 0, 200, 0.7);
			text-decoration: underline;
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
			top: .586667rem/* 44/75 */
			;
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
			background-color: rgba(0, 0, 0, 0.2);
			text-indent: .586667rem/* 44/75 */
			;
			color: #FFF;
		}
	}
</style>