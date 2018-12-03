<!--邀请记录-->
<template lang="html">
	<box class="app">
		<!-- <x-header :left-options="{backText: ''}">set empty back text</x-header> -->
		<div class="app-container">
			<group class="dsh-group" v-if="data">
				<cell class="dsh-cell" v-for="item in itemsRecord" :key="item.userName" :title="item.userName" :value="item.responseDate">
					<img slot="icon" :src="item.headUrl" alt="">
				</cell>
			</group>
			<div v-if="noData" class="myPoints-noIntegral">
				<img :src="biaoqing" />
				<p>您还没有邀请过人哦~</p>
			</div>
		</div>
	</box>
</template>

<script>
	import { Box, Group, Cell } from 'vux'
	import biaoqing from '@/assets/biaoqing.png'
	const DshButton = () =>
		import('@/components/DshButton/DshButton.vue').then(m => m.default)
	import ViewInvitationRecortHead from '@/assets/ViewInvitationRecortHead.png'
	export default {
		name: '邀请记录',
		components: {
			Box,
			Group,
			DshButton,
			Cell
		},
		data() {
			return {
				token: '',
				biaoqing: biaoqing,
				data: false,
				noData: false,
				img: {
					ViewInvitationRecortHead: ViewInvitationRecortHead
				},
				itemsRecord: []
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
			this.$http.post('I_SCRM_WX_INTERFACE_054.action', {
				openId: this.token,
			}).then((res) => {
				let data = res.data,
					code = data.returnCode,
					msg = data.returnMsg;
				console.log(JSON.stringify(data) + '054')
				if(code == '0') {
					this.itemsRecord = msg;
					if(msg.length > 0) {
						this.data = true;
					} else {
						this.noData = true;
					}
				}
			});
		}
	}
</script>

<style lang="less">
	.dsh-cell {
		height: 128*@rem;
		padding: 30*@rem 40*@rem 18*@rem 50*@rem;
		.weui-cell__hd {
			width: 80*@rem;
			height: 80*@rem;
			margin-right: 40*@rem;
			border-radius: 50%;
			overflow: hidden;
			img {
				width: 80*@rem;
				height: 80*@rem;
			}
		}
	}
	
	.myPoints-noIntegral {
		padding-top: 5.04rem;
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
</style>