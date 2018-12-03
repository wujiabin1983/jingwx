<!--门店活动详情-->
<template lang="html">
	<box class="app">
		<div class="app-container">
			<div class="activityInfo-title">{{activityInfo.activityTitle}}</div>
			<div class="activityInfo-container">
				<div class="activityInfo-subtitle">
					<span class="activityInfo-date">{{activityInfo.pushDate}}</span><span class="activityInfo-storeName">{{activityInfo.storeName}}</span>
				</div>
				<div class="activityInfo-mianDesc" v-html="activityInfo.mainBody"></div>
			</div>
		</div>
	</box>
</template>

<script>
	import { Box } from 'vux'
	export default {
		name: '门店活动',
		components: {
			Box
		},
		data() {
			return {
				token: '',
				activityInfo: {
					pushDate: "",
					activityTitle: "",
					summary: "",
					storeName: "",
					mianDesc: "",
					getFormData: "",
					getFormStoreId: ""
				},
			}
		},
		methods: {
			showInfo() {}
		},
		computed: {},
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
			this.getFormData = sessionStorage.getItem("formData");
			this.getFormStoreId = sessionStorage.getItem("storeId");
			if(JSON.parse(this.getFormData).id) {
				this.$http.post('I_SCRM_WX_INTERFACE_012.action', {
					openId: this.token,
					"storeId": this.getFormStoreId,
					"id": JSON.parse(this.getFormData).id
				}).then((res) => {
					let data = res.data,
						code = data.returnCode,
						msg = data.returnMsg;
					console.log(JSON.stringify(data))
					if(code == '0') {
						this.activityInfo = msg;
					}
				});
			}
		}
	}
</script>

<style lang="less">
	.activityInfo-title {
		width: 100%;
		height: 74*@rem;
		line-height: 74*@rem;
		font-size: 36*@rem;
		color: #3b3b3b;
		text-align: center;
	}
	
	.activityInfo-container {
		padding: 14*@rem 52*@rem 0 52*@rem;
		.activityInfo-subtitle {
			color: #b7b7b7;
			font-size: 26*@rem;
			height: 46*@rem;
			line-height: 46*@rem;
			.activityInfo-date {
				margin-right: 20*@rem;
			}
			.activityInfo-storeName {}
		}
		.activityInfo-mianDesc {
			p {
				line-height: 54*@rem;
				text-align: left;
				font-size: 26*@rem;
				color: #3b3b3b;
			}
			img {
				width: 100%;
				height: 100%;
			}
		}
	}
</style>