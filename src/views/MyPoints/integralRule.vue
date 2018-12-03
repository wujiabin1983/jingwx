<!--积分规则-->
<template lang="html">
	<box class="app dsh-box">
		<div class="app-container">
			<div class="integralRule-container" v-html="data" v-if="data!=''">
			</div>
			<div class="integralRule-noOrderList" v-if="data==''||!data">
				<img :src="biaoqing" />
				<p>暂时没有设置积分规则</p>
			</div>
		</div>
	</box>
</template>

<script>
	import { Box } from 'vux'
	import biaoqing from '@/assets/biaoqing.png'
	const DshButton = () =>
		import('@/components/DshButton/DshButton.vue').then(m => m.default)
	export default {
		name: '我的积分',
		components: {
			DshButton,
			Box
		},
		data() {
			return {
				token:'',
				biaoqing: biaoqing,
				data: '',
				integralRuleData: [{
					integralTiile: '1.什么是积分',
					integralContent: '积分是会员在实体门店购物消费或者微信中心完成指定行为后给予的福利。积分是会员在实体门店购物消费或者微信中心完成指定行为后给予的福利。积分是会员在实体门店购物消费或者微信中心完成指定行为后给予的福利。积分是会员在实体门店购物消费或者微信中心完成指定行为后给予的福利',
				}, {
					integralTiile: '2.如何获得积分',
					integralContent: '购物获得 — 会员在门店消费获取',
				}, {
					integralTiile: '3.如何使用积分',
					integralContent: '可使用积分在积分商城中兑换优惠券或礼品券。',
				}, ],
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
			var data = sessionStorage.getItem('inteRule');
			this.data = data;
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
	.integralRule-noOrderList {
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
	
	.integralRule-container {
		padding: 58*@rem 40*@rem 0 40*@rem;
		.integralRule-item {
			margin-bottom: 58*@rem;
			.integralRule-title {
				font-size: 30*@rem;
				color: #212121;
				height: 60*@rem;
				line-height: 60*@rem;
			}
			.integralRule-content {
				font-size: 24*@rem;
				line-height: 44*@rem;
				color: #585858;
			}
		}
	}
</style>