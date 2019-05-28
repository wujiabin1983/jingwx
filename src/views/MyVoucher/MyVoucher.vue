<!--我的券列表-->
<template lang="html">
	<box class="app">
		<div class="app-container">
			<tab :line-width=2 active-color='#5585E3' custom-bar-width="40px">
				<tab-item selected @on-item-click="handleTabChange"  class="vux-1px-r">可使用</tab-item>
				<tab-item @on-item-click="handleTabChange" class="vux-1px-r">已使用</tab-item>
				<tab-item @on-item-click="handleTabChange" >已失效</tab-item>
			</tab>
			<scroller lock-x :height="'-44'" @on-scroll-bottom="onScrollBottom" ref="scrollerBottom" :scroll-bottom-offst="100">
				<div class="box2">
					<div class="scrm-tabs__content">
						<dsh-empty v-if="!couponDataList.length>0" text="您还没有券哦~"></dsh-empty>
						<div class="tabpanel" v-else>
							<template v-for="item in couponDataList" >
								<dsh-coupon v-if="couponStatus == 0" :coupon-info="item" :key="item.coupId" @click.native="goDetail(item)" ></dsh-coupon>
								<dsh-coupon v-esle :coupon-info="item" :key="item.coupId" ></dsh-coupon>
							</template>
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
	//shine
	import DshCoupon from '@/components/Coupon/Coupon.vue'
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
			DshEmpty,
			DshCoupon
			
		},
		data() {
			return {
				
				isEmpty: false, //没有数据
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
				//shine
				couponStatus:0,
				onFetching: false,
				pageCount:0,
				couponDataList:[],
				isEmpty:false,
			}
		},
		computed: {

		},
		created() {
			document.oncontextmenu = function(e) {
				//或者return false;
				e.preventDefault();
			};
			//console.log(localStorage.setItem("token", this.token))
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
			this.getCouponData()
			
		},
		methods: {
			goDetail(item){
				localStorage.setItem('myVoucheActivityId', item.activityId);
				localStorage.setItem('myVoucheCoupId', item.coupId);
				this.$router.push({ name: 'MyVoucherDetails', params: { activityId:item.activityId,coupId: item.coupId }})
			},
			handleTabChange(index){
				this.pageCount=0;
				this.couponStatus = index
				this.getCouponData()
			},
			getCouponData(){
				let params = {
					openId: this.token,
					"coupStatus": this.couponStatus, // 券状态(0:可使用/   1：已使用 /    2：已过期    /"":全部)
					"coupType": '', //展示所有类型的卷 券类型("":全部/代金券/折扣券/礼品券)
					"start": this.pageCount, //开始记录数
					"limit": 6 //每页记录数
				}
				console.log(params)
				this.$http.post('I_SCRM_WX_INTERFACE_013.action', params).then((res) => {
					let data = res.data,
						code = data.returnCode,
						msg = data.returnMsg; 
					if(code == '0') {
						this.couponDataList = msg;
						this.itemsVoucher = msg;//old
						// this.isEmpty = !(msg.length>=0);
						if(msg.length < params.limit) {
							this.loadMore = false;
						}
					
					}
				});
			},
			/////old
			
			onScrollBottom() {
				console.log('onScrollBottom')
				if(this.onFetching) {
					// do nothing
				} else {
					this.onFetching = true
					setTimeout(() => {
						this.bottomCount += 5
						this.getCouponData(this.bottomCount);
						this.$nextTick(() => {
							this.$refs.scrollerBottom.reset()
						})
						this.onFetching = false
					}, 2000)
				}
			},
		
		},
		
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
	
	.scrm-tabs__content {
		// background-color: blue;
		padding: 20*@rem 25*@rem 0;
	}
	
	.tab-one {
		overflow: hidden;
	}
</style>