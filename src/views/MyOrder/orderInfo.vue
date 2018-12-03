<!--订单详情-->
<template lang="html">
	<box class="app">
		<div class="app-container">
			<div class="orderInfo-container">
				<p class="orderInfo-title">{{orderData.storeName}}</p>
				<div class="orderInfo-data">
					<div v-for="data in orderData.dataList" class="orderInfo-item">
						<span class="orderInfo-name">{{data.goodName}}</span><span class="orderInfo-price">{{data.amount}}</span>
						<span class="orderInfo-priceOld">{{data.commodityTagPrice}}</span>
						<span class="orderInfo-count">X{{data.qty}}</span>
					</div>
				</div>
				<div class="orderInfo-payment">
					<p class="orderInfo-other"><span class="orderInfo-type">应付</span><span class="orderInfo-sumPrice">{{orderData.totalAmount}}</span></p>
					<p class="orderInfo-other"><span class="orderInfo-type">实付</span><span class="orderInfo-sumPrice">{{orderData.payAmount}}</span></p>
					<p class="orderInfo-otherData">
						<span>付款方式: {{orderData.payType}}</span>
						<span>付款时间: {{orderData.payDate}}</span>
						<span>订单编号: {{orderData.orderCode}}</span>
					</p>
				</div>
			</div>
			<loading :show="show2" text=""></loading>
		</div>
	</box>
</template>

<script>
	import { Box, Loading } from 'vux'
	export default {
		name: '我的订单',
		components: {
			Box,
			Loading
		},
		data() {
			return {
				token: '',
				show2: true,
				orderData: {
					storeName: "",
					dataList: [],
					orderCode: "",
					totalAmount: "",
					payAmount: "",
					payType: "",
					payDate: "",
				},
			}
		},
		methods: {

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
			setTimeout(() => {
				this.show2 = false;
			}, 3000)
			this.$http.post('I_SCRM_WX_INTERFACE_044.action', {
				openId: this.token,
				id: sessionStorage.getItem("orderData")
			}).then((res) => {
				this.show2 = false;
				let data = res.data,
					code = data.returnCode,
					msg = data.returnMsg;
				if(code == '0') {
					this.orderData = msg;
					this.orderData.payType = "在线支付";
					console.log(JSON.stringify(data) + '044')
				}
			});
		}
	}
</script>

<style lang="less">
	.orderInfo-container {
		.orderInfo-title {
			height: 88*@rem;
			line-height: 88*@rem;
			padding: 0 50*@rem;
			font-size: 35*@rem;
			color: #3b3b3b;
			background: #fff;
		}
		.orderInfo-data {
			background: #fff;
			padding: 0 20*@rem;
			margin: 24*@rem 0;
			.orderInfo-item {
				padding: 10*@rem 20*@rem 0 30*@rem;
				border-bottom: 1*@rem solid #dcdcdc;
				span {
					font-size: 30*@rem;
					display: inline-block;
					color: #3b3b3b;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
				}
				.orderInfo-name {
					width: 50%;
					height: 65*@rem;
					line-height: 65*@rem;
					color: #3b3b3b;
				}
				.orderInfo-price {
					width: 50%;
					text-align: right;
					color: #f79628;
				}
				.orderInfo-priceOld {
					width: 100%;
					text-align: right;
					text-decoration: line-through;
					color: #949494
				}
				.orderInfo-count {
					width: 100%;
					text-align: right;
				}
			}
			.orderInfo-item:last-child {
				border: none
			}
		}
		.orderInfo-payment {
			background: #fff;
			padding: 0 20*@rem;
			.orderInfo-other {
				height: 90*@rem;
				line-height: 90*@rem;
				padding: 0 30*@rem;
				font-size: 30*@rem;
				border-bottom: 1*@rem solid #dcdcdc;
				.orderInfo-type {
					float: left;
				}
				.orderInfo-sumPrice {
					float: right;
					color: #f79628;
				}
			}
			.orderInfo-otherData {
				padding: 38*@rem 30*@rem;
				span {
					height: 46*@rem;
					line-height: 46*@rem;
					display: block;
					color: #949494
				}
			}
		}
	}
</style>