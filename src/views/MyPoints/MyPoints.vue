<!--我的积分-->
<template lang="html">
	<box class="app dsh-box">
		<div class="app-container">
			<div class="myPoints-bg" :style="backgroundStyle">
				<p class="myPoints-title"><span class="fl">当前积分</span><span class="fr" @click="integralRuleFn"><i :style="helpIconStyle"></i> 积分规则</span></p>
				<p class="myPoints-currentIntegral">{{avaInte}}</p>
				<p class="myPoints-pointsExpiration" v-if="avaInte>0&&forthInte>0">{{forthInte}}积分将于{{validityDate}}过期</p>
				<dsh-button type="lucency" size="174-1" v-if="avaInte>0" class="myPoints-btn" @click.native="myPointsFn" :disabled="false" title="立即兑换" text="立即兑换"></dsh-button>
			</div>
			<p class="myPoints-title-br">积分明细</p>
			<div class="myPoints-container" v-if="avaInteData">
				<scroller lock-x :height="height" @on-scroll-bottom="onScrollBottomList" ref="scrollerBottomList" :scroll-bottom-offst="100">
					<div>
						<div class="myPoints-item" v-for="item in exchangeItemsOne" :key="item.integralName">
							<div class="content-item">
								<p class="item-title"><span class="myPoints-integralName">{{item.goodsName}}</span></p>
								<p class="item-info"><span class="myPoints-storeName">{{item.storeName}}</span><span class="myPoints-integral-value">{{item.inteValue}}</span></p>
								<p class="item-date"><span>{{item.happenDate}}</span></p>
							</div>
						</div>
						<load-more tip="loading" v-if="loadListData"></load-more>
					</div>
				</scroller>
			</div>
			<div v-if="avaInteNoData" class="myPoints-noIntegral">
				<img :src="biaoqing" />
				<p>您还没有积分哦~</p>
			</div>
			<div v-if="avaInteNoDataInfo" class="myPoints-noIntegral">
				<img :src="biaoqing" />
				<p>您还没有积分明细哦~</p>
			</div>
		</div>
	</box>
</template>

<script>
	import biaoqing from '@/assets/biaoqing.png'
	import background from '@/assets/background.png'
	import helpIcon from '@/assets/help-icon.png'
	import { Box, Scroller, LoadMore } from 'vux'
	const DshButton = () =>
		import('@/components/DshButton/DshButton.vue').then(m => m.default)
	export default {
		name: '我的积分',
		components: {
			DshButton,
			Box,
			Scroller,
			LoadMore,
		},
		data() {
			return {
				token: '',
				height: '',
				loadListData: true,
				avaInteNoDataInfo: false,
				avaInteData: false,
				avaInteNoData: false,
				backgroundStyle: {
					'background-image': `url(${background})`
				},
				helpIconStyle: {
					'background-image': `url(${helpIcon})`
				},
				biaoqing: biaoqing,
				avaInte: '0',
				listCount: 0,
				forthInte: '',
				validityDate: '',
				exchangeItemsOne: [],
				//				{
				//					integralName: '购物-积分发放',
				//					storeName: '【xxx旗舰店】',
				//					integralValue: '+5',
				//					integralDate: '2018-06-01 13:09:03'
				//				}, {
				//					integralName: '积分兑换-精美男装',
				//					storeName: '【xxx旗舰店】',
				//					integralValue: '-150',
				//					integralDate: '2018-06-02 13:09:03'
				//				}, {
				//					integralName: '购物-积分发1放',
				//					storeName: '【xxx旗舰店】',
				//					integralValue: '+5',
				//					integralDate: '2018-06-03 12:19:03'
				//				}
			}
		},
		methods: {
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
				this.listCount += 5;
				let params = {
					openId: this.token,
					start: this.listCount,
					limit: 6
				}
				this.loadingData(params);
			},
			integralRuleFn() {
				this.$router.push({
					name: '积分规则'
				});
			},
			myPointsFn() {
				sessionStorage.setItem("myPoints", this.avaInte);
				this.$router.push({
					name: '积分兑换'
				});
			},
			loadingData(params) {
				this.$http.post('I_SCRM_WX_INTERFACE_020.action', params).then((res) => {
					let data = res.data,
						code = data.returnCode,
						msg = data.returnMsg;
					if(code == '0') {
						if(msg.length > 0) {
							this.avaInteNoDataInfo = false;
						} else {
							this.avaInteNoDataInfo = true;
						}
						if(this.avaInte == "0") {
							this.avaInteNoDataInfo = false;
						}
						this.exchangeItemsOne = [];
						msg.forEach((val, index) => {
							this.exchangeItemsOne.push({
								...val
							})
							if(val.inteDir == "收入") {
								this.exchangeItemsOne[index].inteValue = '+' + this.exchangeItemsOne[index].inteValue;
							}
							if(val.inteDir == "支出") {
								this.exchangeItemsOne[index].inteValue = '-' + this.exchangeItemsOne[index].inteValue;
							}
						})
						if(msg.length < params.limit) {
							this.loadListData = false;
							this.onFetching = true;
						}
//						console.log(JSON.stringify(msg) + "020");
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
			this.$nextTick(function() {
				let bodyHeight = document.body.offsetHeight;
				let myPointsBgHeight = document.getElementsByClassName("myPoints-bg")[0].offsetHeight;
				let myPointsBrHeight = document.getElementsByClassName("myPoints-title-br")[0].offsetHeight;
				this.height = bodyHeight - myPointsBgHeight - myPointsBrHeight - 30 + "px";
			})
			this.$http.post('I_SCRM_WX_INTERFACE_019.action', {
				openId: this.token,
			}).then((res) => {
				let data = res.data,
					code = data.returnCode,
					msg = data.returnMsg;
				if(code == '0') {
					this.avaInte = msg.avaInte==""?0:msg.avaInte;
					if(this.avaInte > 0) {
						this.avaInteNoData = false;
						this.avaInteData = true;
					} else {
						this.avaInteNoData = true;
						this.avaInteNoDataInfo = false;
						this.avaInteData = false;
					}
					this.forthInte = msg.forthInte;
					this.validityDate = msg.validityDate;
					this.integralDesc = msg.integralDesc;
					sessionStorage.setItem('inteRule', msg.inteRule);
//					console.log(JSON.stringify(msg) + "019");
				}
			});
			let params = {
				openId: this.token,
				start: this.listCount,
				limit: 6
			}
			this.loadingData(params);
		}
	}
</script>

<style lang="less">
	.myPoints-bg {
		background: no-repeat center;
		background-size: 100%;
		color: #fff;
		padding: 0 25*@rem;
		padding-bottom: 34*@rem;
		.myPoints-title {
			height: 100*@rem;
			line-height: 100*@rem;
			font-size: 28*@rem;
			.fl {
				float: left;
			}
			.fr {
				float: right;
			}
			i {
				color: #5486dd;
				background: #FFFFFF;
				border-radius: 50%;
				width: 25*@rem;
				height: 25*@rem;
				background: no-repeat center;
				background-size: 100%;
				display: inline-block;
			}
		}
		.myPoints-currentIntegral {
			font-size: 90*@rem;
			text-align: center;
		}
		.myPoints-pointsExpiration {
			text-align: center;
			height: 70*@rem;
			line-height: 70*@rem;
			margin-bottom: 20*@rem;
		}
	}
	
	.myPoints-title-br {
		height: 88*@rem;
		line-height: 88*@rem;
		background: #f8f8f8;
		padding-left: 30*@rem;
		font-size: 30*@rem;
		color: #272727;
	}
	
	.myPoints-container {
		padding: 0 30*@rem;
		background: #FFF;
		.myPoints-item {
			display: flex;
			justify-content: flex-start;
			border-bottom: 1*@rem solid #CCC;
		}
		.content-item {
			width: 100%;
			position: relative;
			padding: 15*@rem 10*@rem 15*@rem 10*@rem;
			.item-title {
				height: 48*@rem;
				line-height: 48*@rem;
				font-size: 30*@rem;
				color: #272727;
			}
			.item-info {
				height: 65*@rem;
				line-height: 65*@rem;
				position: relative;
				font-size: 24*@rem;
				color: #c2c2c2;
				.myPoints-integral-value {
					position: absolute;
					right: 10*@rem;
					font-size: 48*@rem;
					color: #f79624;
				}
			}
			.item-date {
				height: 44*@rem;
				line-height: 44*@rem;
				position: relative;
				font-size: 24*@rem;
				color: #c2c2c2;
			}
		}
	}
	
	.myPoints-noIntegral {
		img {
			width: 348*@rem;
			height: 216*@rem;
			display: block;
			margin: 0 auto;
			margin-top: 124*@rem;
		}
		p {
			text-align: center;
			padding-top: 56*@rem;
			color: #aaa;
		}
	}
</style>