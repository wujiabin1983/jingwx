<!--会员卡详情-->
<template lang="html">
	<box class="app dsh-box">
		<div class="app-container">
			<div class="myCardInfo-container">
				<p class="myCardInfo-title">会员卡详情</p>
				<p class="myCardInfo-item"><span>特权说明</span><span>{{myCardInfo.cardType}}</span></p>
				<p class="myCardInfo-item"><span>有效日期</span><span>{{myCardInfo.myCardDate}}</span></p>
				<p class="myCardInfo-item"><span>使用须知</span><span>{{myCardInfo.cardInfo}}</span></p>
			</div>
		</div>
	</box>
</template>

<script>
	import { Cell } from 'vux'
	const DshButton = () =>
		import('@/components/DshButton/DshButton.vue').then(m => m.default)
	const DshBr = () =>
		import('@/components/DshBr/DshBr.vue').then(m => m.default)
	export default {
		name: '我的会员卡',
		components: {
			Cell,
			DshBr
		},
		data() {
			return {
				token: '',
				myCardInfo: {
					cardType: "1、金卡1折优惠  2、银卡2折优惠  3、会员日专享优惠",
					myCardDate: "2018.09.09",
					cardInfo: "每人限领每人限领每人限领每人限领每人限领每人限领每人限领每人限领",
				},
				memberInfo: {
					name: "会员卡详情"
				}
			}
		},
		methods: {

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
		}
	}
</script>

<style lang="less">
	.myCardInfo-container {
		padding: 0 20*@rem;
		padding-top: 24*@rem;
		.myCardInfo-title {
			height: 70*@rem;
			line-height: 70*@rem;
			font-size: 30*@rem;
			padding: 0 32*@rem;
			margin-bottom: 20*@rem;
		}
		.myCardInfo-item {
			color: #7b7b7b;
			font-size: 26*@rem;
			padding: 0 32*@rem;
			overflow: hidden;
			border-bottom: 1*@rem dashed #c8c8c8;
			span {
				line-height: 100*@rem;
				float: left;
			}
			span:first-child {
				width: 20%;
			}
			span:last-child {
				width: 80%;
			}
		}
	}
</style>