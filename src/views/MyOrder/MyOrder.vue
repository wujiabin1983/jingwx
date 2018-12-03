<!--我的订单-->
<template lang="html">
	<box class="app">
		<div class="app-container">
			<div class="myOrder-container" v-if="orderData">
				<scroller lock-x :height="height" @on-scroll-bottom="onScrollBottomList" ref="scrollerBottomList" :scroll-bottom-offst="100">
					<div>
						<div class="myOrder-item" v-for="item in orderList" :key="item.id">
							<div class="myOrder-content">
								<p class="item-title">
									<span class="myOrder-storeName">{{item.storeName}}</span>
									<span class="myOrder-date">{{item.consumeDate}}</span>
								</p>
								<div class="myOrder-orderInfo">
									<p v-for="data in item.orderInfo"><span class="orderInfo-name">{{data.goodName}}</span><span class="orderInfo-count">{{data.qty}}</span><span class="orderInfo-price">{{data.amount}}</span></p>
								</div>
								<p class="myOrder-other"><span class="myOrder-orderNo">订单号：{{item.orderCode}}</span><span class="myOrder-orderInfoCount">共{{item.totalQty}}件</span><span class="myOrder-sumPrice">共计<i>{{item.totalAmount}}</i></span></p>
								<div class="myOrder-btn">
									<dsh-button type="info" size="132" class="myOrder-button" @click.native="clickInfo(item.id)" :disabled="false" title="查看详情" text="查看详情"></dsh-button>
								</div>
							</div>
						</div>
						<load-more tip="loading" v-if="loadListData"></load-more>
					</div>
				</scroller>
			</div>
			<div class="myOrder-noOrderList" v-if="orderNoData">
				<img :src="biaoqing" />
				<p>您还没有订单哦~</p>
			</div>
		</div>
		<loading :show="show2" text=""></loading>
	</box>
</template>

<script>
	import biaoqing from '@/assets/biaoqing.png'
	import { Box, Loading, Scroller, LoadMore, } from 'vux'
	const DshButton = () =>
		import('@/components/DshButton/DshButton.vue').then(m => m.default)
	export default {
		name: '我的订单',
		components: {
			DshButton,
			Box,
			Loading,
			Scroller,
			LoadMore,
		},
		data() {
			return {
				token: '',
				height: '',
				show2: true,
				orderNoData: false,
				orderData: true,
				biaoqing: biaoqing,
				orderList: [],
				start: 5,
				loadListData: true,
			}
		},
		methods: {
			//分页列表
			onScrollBottomList() {
				if(this.onFetching) {
					// do nothing
				} else {
					this.onFetching = true
					setTimeout(() => {
						this.loadingMoreListData();
						this.$nextTick(() => {
							this.$refs.scrollerBottomList.reset()
						})
						this.onFetching = false
					}, 2000)
				}
			},
			loadingMoreListData() {
				this.start += 5;
				let params = {
					openId: this.token,
					start: this.start,
					limit:6
				}
				this.loadingData(params);
			},
			clickInfo(data) {
				sessionStorage.setItem("orderData", data);
				this.$router.push({
					name: '订单详情'
				});
			},
			loadingData(params) {
				this.$http.post('I_SCRM_WX_INTERFACE_025.action', params).then((res) => {
					let data = res.data,
						code = data.returnCode,
						msg = data.returnMsg;
					console.log(JSON.stringify(data) + '025')
					if(code == '0') {
						this.show2 = false;
						this.orderList = msg;
						if(msg.length > 0) {
							this.orderNoData = false;
							this.orderData = true;
						} else {
							this.orderNoData = true;
							this.orderData = false;
						}
						if(msg.length < params.limit) {
							this.loadListData = false;
							this.onFetching = true;
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
			this.height = document.body.offsetHeight + "px";
			let params = {
				openId: this.token,
				start: this.start,
				limit: 6
			}
			this.loadingData(params);
		}
	}
</script>

<style lang="less">
	.myOrder-container {
		padding-top: 8*@rem;
		.myOrder-item {
			width: 100%;
			padding: 0 30*@rem;
			box-sizing: border-box;
			margin-bottom: 24*@rem;
			background: #fff;
			.myOrder-content {
				.item-title {
					height: 74*@rem;
					line-height: 74*@rem;
					padding: 0 20*@rem;
					border-bottom: 1*@rem solid #dcdcdc;
					.myOrder-storeName {
						font-size: 30*@rem;
						color: #3b3b3b;
						float: left;
					}
					.myOrder-date {
						float: right;
						font-size: 24*@rem;
						color: #949494;
					}
				}
				.myOrder-orderInfo {
					padding: 20*@rem 20*@rem 6*@rem 20*@rem;
					p {
						height: 70*@rem;
						line-height: 70*@rem;
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
						}
						.orderInfo-count {
							width: 10%;
							text-align: center;
						}
						.orderInfo-price {
							width: 40%;
							text-align: right;
							color: #f79628;
						}
					}
				}
				.myOrder-other {
					padding: 0 20*@rem;
					padding-bottom: 18*@rem;
					height: 64*@rem;
					line-height: 64*@rem;
					font-size: 24*@rem;
					color: #949494;
					border-bottom: 1*@rem solid #dcdcdc;
					span {
						display: inline-block;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
					}
					.myOrder-orderNo {
						width: 48%;
					}
					.myOrder-orderInfoCount {
						width: 22%;
					}
					.myOrder-sumPrice {
						width: 30%;
						text-align: right;
						i {
							font-style: normal;
							font-size: 30*@rem;
							color: #f79628;
						}
					}
				}
				.myOrder-btn {
					height: 90*@rem;
					line-height: 90*@rem;
					padding-right: 20*@rem;
					.myOrder-button {
						float: right;
						margin-top: 20*@rem;
					}
				}
			}
		}
	}
	
	.myOrder-noOrderList {
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
</style>