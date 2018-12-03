<!--关注公众号-->
<template lang="html">
	<box class="app">
		<!-- <x-header :left-options="{backText: ''}">set empty back text</x-header> -->
		<div class="attention-public">
			<p class="title">XXX分享给您一张优惠券</p>
			<dsh-voucher class="voucher" v-for="item in itemsVoucher" :key="item.tabType" :tabType="item.tabType" :price="item.price" :type="item.type" :info="item.info" :subInfo="item.subInfo" :time="item.time" :disabled="true"></dsh-voucher>
			<div class="qrcode">
				<img :src="img.MyVoucherDetailsQrcode2" alt="">
			</div>
			<p class="info">领取成功，关注公众号查看并使用</p>
		</div>
	</box>
</template>

<script>
	import { Box } from 'vux'
	const DshButton = () =>
		import('@/components/DshButton/DshButton.vue').then(m => m.default)
	const DshVoucher = () =>
		import('@/components/DshVoucher/DshVoucher.vue').then(m => m.default)
	// const DshBr = () => import('@/components/DshBr/DshBr.vue').then(m => m.default)
	import more from '@/assets/more.png'
	import MyVoucherDetailsQrcode2 from '@/assets/MyVoucherDetailsQrcode2.png'
	export default {
		name: '关注公众号',
		components: {
			Box,
			DshButton,
			DshVoucher
		},
		data() {
			return {
				token: '',
				img: {
					MyVoucherDetailsQrcode2: MyVoucherDetailsQrcode2
				},
				itemsVoucher: [{
					'tabType': '可使用',
					'price': '100',
					'type': '代金券',
					'info': '满200元使用',
					'subInfo': '仅限门店新客使用',
					'time': '2017-09-01至2017-12-01',
				}],
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
	.attention-public {
		text-align: center;
		.title {
			padding: 86*@rem 0 80*@rem;
			font-size: 36*@rem;
			color: #373737;
		}
		.voucher {
			.dsh-voucher {
				margin: 0 auto;
			}
		}
		.qrcode {
			width: 220*@rem;
			height: 220*@rem;
			margin: 160*@rem auto 58*@rem;
			background: #CCC;
			img {
				width: 220*@rem;
				height: 220*@rem;
			}
		}
		.info {
			font-size: 32*@rem;
			color: #373737;
		}
	}
</style>