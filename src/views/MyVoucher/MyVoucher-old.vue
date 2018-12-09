<!--我的券列表-->
<template lang="html">
	<box class="app">
		<div class="app-container">
			<div class="tab-top-voucher">
				<span class="pull-down-menu" @click="handlePullDown">{{!voucherType ? '券类型' : voucherType}}<x-icon class="dsh-pull-arrow" type="ios-arrow-down" size="15"></x-icon></span>
				<span class="pull-down-menu" @click="handlePullDown1">{{!voucherType1 ? '适用类型' : voucherType1}}<x-icon class="dsh-pull-arrow" type="ios-arrow-down" size="15"></x-icon></span>
				<actionsheet v-model="pullDown" :menus="pullDownMenu" theme="android" @on-click-menu="handleMenuClick"></actionsheet>
				<actionsheet v-model="pullDown1" :menus="pullDownMenu1" theme="android" @on-click-menu="handleMenuClick1"></actionsheet>
			</div>
			<scroller lock-x :height="height" @on-scroll-bottom="onScrollBottom" ref="scrollerBottom" :scroll-bottom-offst="100">
				<div class="box2">
					<div class="tab-content-voucher">
						<dsh-empty v-if="itemsVoucherFlag" :text="text"></dsh-empty>
						<div class="tab-one" v-else>
							<dsh-voucher v-for="item in itemsVoucher" :key="item.coupId" :activityId="item.activityId" :coupId="item.coupId" :tabType="item.status" :price="item.couponValue" :type="item.coupType" :info="item.coupName" :isBtn="true" :subInfo="item.useThreshold" :time="item.coupDate" :bgColor="item.bgColor"></dsh-voucher>
						</div>
					</div>
					<load-more tip="loading" v-if="loadMore"></load-more>
				</div>
			</scroller>
		</div>
	</box>
</template>

<script>
	import { Box, Group, Tab, TabItem, Scroller, LoadMore, Actionsheet } from 'vux'
	const DshButton = () =>
		import('@/components/DshButton/DshButton.vue').then(m => m.default)
	const DshVoucher = () =>
		import('@/components/DshVoucher/DshVoucher.vue').then(m => m.default)
	const DshEmpty = () =>
		import('@/components/DshEmpty/DshEmpty.vue').then(m => m.default)
	export default {
		name: '我的券',
		components: {
			Box,
			Group,
			Tab,
			TabItem,
			DshVoucher,
			Scroller,
			LoadMore,
			Actionsheet,
			DshEmpty
		},
		data() {
			return {
				itemsVoucherFlag: false, //没有数据
				text: '您还没有券哦~',
				token: '',
				// 券类型
				pullDown: false,
				pullDownMenu: ['全部', '代金券', '折扣券', '礼品券'],
				// 适用类型
				pullDown1: false,
				pullDownMenu1: ['全部', '可使用', '已使用', '已过期'],

				isDroupDownClose: false,
				// 顶部菜单搜索类型
				voucherType: '全部', // 券类型
				voucherType1: '全部', // 适用类型
				voucherItemName: '可使用',
				itemsVoucher: [],

				height: '',
				loadMore: true,
				bottomCount: 0,
			}
		},
		methods: {
			// 菜单点击
			handlePullDown() {
				this.pullDown = true;
			},
			handlePullDown1() {
				this.pullDown1 = true;
			},
			handleMenuClick(value) {
				this.itemsVoucher = [];
				this.voucherType = this.pullDownMenu[value];
				this.bottomCount = 0;
				this.loadingMoreData(this.bottomCount);
			},
			handleMenuClick1(value) {
				this.itemsVoucher = [];
				this.voucherType1 = this.pullDownMenu1[value];
				this.bottomCount = 0;
				this.loadingMoreData(this.bottomCount);
			},
			// 选项卡切换
			handleTabClick(i) {
				if(i == 0) {
					this.voucherItemName = '可使用';
				} else if(i == 1) {
					this.voucherItemName = '已使用';
				} else if(i == 2) {
					this.voucherItemName = '已过期';
				}
			},
			// 搜索 券类型
			handleSetItem(item) {
				this.voucherType = item;
				this.loadingMoreData(this.bottomCount);
			},
			// 搜索 适用类型
			//jj(目前无用？)
			handleSetItem1(item) {
				this.voucherType1 = item;
				this.loadingMoreData(this.bottomCount);
			},
			onScrollBottom() {
				console.log('onScrollBottom')
				if(this.onFetching) {
					// do nothing
				} else {
					this.onFetching = true
					setTimeout(() => {
						this.bottomCount += 5
						this.loadingMoreData(this.bottomCount);
						this.$nextTick(() => {
							this.$refs.scrollerBottom.reset()
						})
						this.onFetching = false
					}, 2000)
				}
			},
			loadingMoreData(start) {
				let params = {
					openId: this.token,
					"coupStatus": this.voucherType1 == '全部' ? '' : (this.voucherType1 == '可使用' ? 0 : (this.voucherType1 == '已使用' ? '1' : '2')), // 券状态(0:可使用/1：已使用/2：已过期/"":全部)
					"coupType": this.voucherType == '全部' ? '' : this.voucherType, // 券类型("":全部/代金券/折扣券/礼品券)
					"start": start, //开始记录数
					"limit": 6 //每页记录数
				}
				this.$http.post('I_SCRM_WX_INTERFACE_013.action', params).then((res) => {
					
					let data = res.data,
						code = data.returnCode,
						msg = data.returnMsg; //  				console.log(JSON.stringify(data)+'013')
					if(code == '0') {
						this.itemsVoucher = msg;
						if(msg.length < params.limit) {
							this.loadMore = false;
						}
						if(msg.length == 0 && this.voucherType == '全部' && this.voucherType1 == '全部') {
							this.itemsVoucherFlag = true;
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
			console.log(localStorage.setItem("token", this.token))
			console.log(window.location.href.split('=')[1])
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
			this.height = document.body.offsetHeight - 50 + "px";
			console.log('creaed-loadingmore')
			this.loadingMoreData(this.bottomCount);
			
		}
	}
</script>

<style lang="less">
	.tab-top-voucher {
		display: flex;
		justify-content: space-between;
		.pull-down-menu {
			width: 50%;
			display: flex;
			align-items: center;
			justify-content: center;
			width: 100%;
			height: 52*@rem;
			line-height: 52*@rem;
			font-size: 30*@rem;
			color: #5486dd;
			border-bottom: 1*@rem solid #5486dd!important;
			&:first-child {
				border-right: 1*@rem solid #5486dd!important;
			}
		}
		.vux-x-icon {
			fill: #5486dd;
		}
	}
	
	.tab-content-voucher {
		padding: 60*@rem 25*@rem 0;
	}
	
	.tab-one {
		overflow: hidden;
	}
</style>